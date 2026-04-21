import { adminBiddingService } from "@/api/admin/bidding";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { FiChevronDown } from "react-icons/fi";

type StatusType = "active" | "pending" | "sold" | "cancelled";

type Props = {
  value?: StatusType;
  biddingId: number;
  onUpdated: () => void;
};

export default function BiddingStatusDropdown({
  value = "pending",
  biddingId,
  onUpdated,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<StatusType | null>(null);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
const statusOrder: StatusType[] = [
  "pending",
  "active",
  "sold",       // Completed
  "cancelled",
];
  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current || !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= STATUS CONFIG ================= */
  const statusConfig: Record<
    StatusType,
    { label: string; btnClass: string; apiValue: number }
  > = {
    active: {
      label: "Active",
      btnClass: "bg-[#34C759] text-white",
      apiValue: 1,
    },
    pending: {
      label: "Pending",
      btnClass: "bg-[#FFCA42] text-black",
      apiValue: 0,
    },
    sold: {
      label: "Completed",
      btnClass: "bg-[#2196F3] text-white",
      apiValue: 2,
    },
    cancelled: {
      label: "Cancelled",
      btnClass: "bg-red-500 text-white",
      apiValue: 3,
    },
  };

  const getSafeStatus = (val?: string): StatusType => {
      if (val === "pending") return "pending";
  if (val === "active") return "active";
  if (val === "sold" || val === "completed") return "sold"; // 🔥 important
  if (val === "cancelled") return "cancelled";
  return "pending"; // fallback
};

const currentStatus: StatusType = getSafeStatus(value);
  const current = statusConfig[currentStatus];

  /* ================= CHANGE HANDLER ================= */
  const handleChange = async (status: StatusType) => {
    try {
      setLoading(status); // 🔥 start loader

      const res = await adminBiddingService.updateBidStatus(
        biddingId,
        statusConfig[status].apiValue,
      );

      if (!res.success) {
        const msg =
          typeof res.message === "string"
            ? res.message
            : res.message?.machinery_id?.[0];

        throw new Error(msg || "API failed");
      }

      toast.success("Status updated");

      onUpdated(); // refresh table
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setLoading(null); // 🔥 stop loader
    }
  };
  /* ================= TOGGLE ================= */
 const handleToggle = () => {
  if (ref.current) {
    const rect = ref.current.getBoundingClientRect();

    const dropdownHeight = 180; // approx height (4 items)
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top = 0;

    // 🔥 decide position
    if (spaceBelow >= dropdownHeight) {
      // open below
      top = rect.bottom + window.scrollY;
    } else if (spaceAbove >= dropdownHeight) {
      // open above
      top = rect.top + window.scrollY - dropdownHeight;
    } else {
      // fallback (fit inside screen)
      top = rect.bottom + window.scrollY;
    }

    setPosition({
      top,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }

  setOpen((p) => !p);
};

  return (
    <div ref={ref} className="relative inline-block">
      {/* BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        className={`flex items-center justify-between gap-2 px-2 py-1.5 w-[110px] rounded-md text-sm font-medium cursor-pointer ${current.btnClass}`}
      >
        {current.label}
        <FiChevronDown
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open &&
        createPortal(
          <div
          onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              width: "110px",
              zIndex: 9999,
            }}
            className="rounded-lg bg-white border border-border shadow-lg mt-1"
          >
            {statusOrder.map((status) => {
                const currentIndex = statusOrder.indexOf(currentStatus);
                const targetIndex = statusOrder.indexOf(status);

                const isCurrent = status === currentStatus;
                const isBackward = targetIndex < currentIndex; // 🔥 reverse block
                const isDisabled = isCurrent || isBackward || loading !== null;
                const isLoading = loading === status;

                return (
                    <button
                    key={status}
                    disabled={isDisabled}
                    onClick={() => {
                        if (!isDisabled) handleChange(status);
                    }}
                    className={`w-full px-4 py-[10px] text-left text-sm border-b border-border last:border-b-0 transition-all duration-150 ${
                        isDisabled
                        ? "text-gray-400 bg-gray-50 cursor-not-allowed opacity-70"
                        : "hover:bg-gray-50 cursor-pointer"
                    }`}
                    >
                    {isLoading ? "Updating..." : statusConfig[status].label}
                    </button>
                );
                })}
          </div>,
          document.body,
        )}
    </div>
  );
}
