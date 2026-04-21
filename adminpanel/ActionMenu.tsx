"use client";
import { useEffect, useRef, useState } from "react";
import { CgMoreVertical } from "react-icons/cg";

export default function ActionMenu({
  onApprove,
  onDecline,
}: {
  onApprove: () => void;
  onDecline: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // outside click close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current || !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      {/* ICON */}
      <CgMoreVertical
        className="cursor-pointer text-gray-500 hover:text-gray-700 transition"
        onClick={() => setOpen(!open)}
      />

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-[140px] rounded-lg
            bg-white  shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden
            z-50"
        >
          <button
            onClick={() => {
              onApprove();
              setOpen(false);
            }}
            className="w-full px-5 py-[10px] text-left text-sm text-gray-800 hover:bg-gray-50 transition"
          >
            Approve
          </button>

          <div className="h-px bg-gray-200" />

          <button
            onClick={() => {
              onDecline();
              setOpen(false);
            }}
            className="w-full px-5 py-[10px] text-left text-sm text-red-600 hover:bg-gray-50 transition"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
}
