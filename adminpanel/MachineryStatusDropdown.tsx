"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { FiChevronDown } from "react-icons/fi";
import { adminMachineryService } from "@/api/admin/machinery";

type StatusType = 0 | 1 | 2;

type Props = {
  value: StatusType;
  machineryId: number;
  onUpdated: () => void;
};

export default function MachineryStatusDropdown({
  value,
  machineryId,
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

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current || !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
  /* ================= STATUS CONFIG ================= */
  const statusConfig = {
    0: {
      label: "Draft",
      btnClass: "bg-gray-500 text-white",
    },
    1: {
      label: "Publish",
      btnClass: "bg-[#34C759] text-white",
    },
    2: {
      label: "Sold",
      btnClass: "bg-[#FFCA42] text-gray",
    },
  };

  const statusOrder: StatusType[] = [0, 1, 2];
  const current = statusConfig[value];

  /* ================= API CALL ================= */
  const handleChange = async (status: StatusType) => {
    if (loading !== null) return; // prevent multiple click

    try {
      setLoading(status);

      const res = await adminMachineryService.updateStatus({
        id: machineryId,
        status,
      });

      if (!res?.status) {
        throw new Error(res?.message || "Failed");
      }

      toast.success("Status updated");

      onUpdated(); // refresh table
      setOpen(false); // ✅ close AFTER success
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    } finally {
      setLoading(null);
    }
  };

  /* ================= POSITION ================= */
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
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        className={`flex items-center justify-between gap-2 px-2 py-1.5 w-[110px] rounded-md text-sm font-medium cursor-pointer ${current.btnClass}`}
      >
        {current.label}
        <FiChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
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
              const isCurrent = status === value;

              return (
                <button
                  key={status}
                  disabled={loading !== null || isCurrent} // ✅ disable current also
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isCurrent) handleChange(status); // extra safety
                  }}
                  className={`w-full px-4 py-[10px] text-left text-sm border-b last:border-b-0
         ${isCurrent ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-50  cursor-pointer"}`}
                >
                  {loading === status ? (
                    <span className="flex items-center gap-2">Updating...</span>
                  ) : (
                    statusConfig[status].label
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
