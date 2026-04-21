import { adminUserService } from "@/api/admin/usersManagement";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { FiChevronDown } from "react-icons/fi";

type StatusType = "Active" | "Blocked";

type Props = {
  value?: StatusType | string | null;
  userId: number;
  onUpdated: () => void;
};

export default function UserStatusDropdown({
  value,
  userId,
  onUpdated,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
const [position, setPosition] = useState({
  top: 0,
  left: 0,
  width: 0,
});
  /* ================= CLICK OUTSIDE ================= */
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  const handler = (e: MouseEvent) => {
    if (
      !ref.current?.contains(e.target as Node) &&
      !dropdownRef.current?.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, []);
  /* ================= STATUS CONFIG ================= */
  const statusConfig: Record<
    StatusType,
    { label: string; btnClass: string; apiValue: 1 | 2 }
  > = {
    Active: {
      label: "Active",
      btnClass: "bg-green-500 text-white",
      apiValue: 1,
    },
    Blocked: {
      label: "Blocked",
      btnClass: "bg-red-500 text-white",
      apiValue: 2,
    },
  };

  const currentStatus: StatusType =
    value === "Blocked" ? "Blocked" : "Active";

  const current = statusConfig[currentStatus];

  /* ================= CHANGE HANDLER ================= */
  const handleChange = async (status: StatusType) => {
    try {
      await adminUserService.changeStatus(
        userId,
        statusConfig[status].apiValue
      );

      toast.success("User status updated");
      setOpen(false);
      onUpdated();
    } catch {
      toast.error("Failed to update status");
    }
  };

const handleToggle = () => {
  if (ref.current) {
    const rect = ref.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + window.scrollY,
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
        onClick={handleToggle}
        className={`flex items-center justify-between gap-2 px-2 py-1.5 w-[90px] sm:w-[100px] rounded-md text-sm font-medium cursor-pointer transition-all duration-150 ${current.btnClass}
        `}
      >
        {current.label}
        <FiChevronDown
          className={`transition-transform duration-200 ${ open ? "rotate-180" : "" }`}
        />
      </button>

      {open &&
  createPortal(
    <div
     ref={dropdownRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        width: position.width,
        zIndex: 9999,
      }}
      className="rounded-lg bg-white border border-border shadow-lg mt-1"
    >
      {(Object.keys(statusConfig) as StatusType[]).map((status) => {
        const isCurrent = status === currentStatus;

        return (
          <button
            key={status}
            disabled={isCurrent}
            onClick={() => !isCurrent && handleChange(status)}
              
            className={`w-full px-6 py-[10px] text-left text-sm transition-all duration-150 border-b border-border last:border-b-0 rounded-t-lg last:rounded-t-0 last:rounded-b-lg ${
              isCurrent
                ? "text-gray-400 bg-gray-50"
                : "hover:bg-gray-50 cursor-pointer"
            }`}
          >
            {status}
          </button>
        );
      })}
    </div>,
    document.body
  )}
    </div>
  );
}
