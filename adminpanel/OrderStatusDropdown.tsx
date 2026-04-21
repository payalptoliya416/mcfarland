"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import { adminOrdersService } from "@/api/admin/orders";

type OrderStatus =
  | "Order Submitted"
  | "Sales Agreement"
  | "Awaiting Invoice"
  | "Settle Payment"
  | "Payment Confirmed"
  | "Processing"
  | "Shipping Started"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

type Props = {
  value: OrderStatus;
  orderId: number;
  orderType: "Checkout" | "Bidding";
  paymentSlipStatus: "Pending" | "Approve" | "Decline";
  paymentSlipUrl?: string;
  onUpdated: () => void;
};

export default function OrderStatusDropdown({
  value,
  orderId,
  orderType,
  paymentSlipStatus,
  paymentSlipUrl,
  onUpdated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const [updating, setUpdating] = useState(false); // ✅ effect

  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ================= STATUS CONFIG ================= */
  const statusConfig: Record<
    OrderStatus,
    { label: string; btnClass: string; apiValue: number }
  > = {
    "Order Submitted": {
      label: "Order Submitted",
      btnClass: "bg-gray-400 text-white",
      apiValue: 0,
    },
    "Sales Agreement": {
      label: "Sales Agreement",
      btnClass: "bg-cyan-500 text-white",
      apiValue: 1,
    },
    "Awaiting Invoice": {
      label: "Awaiting Invoice",
      btnClass: "bg-purple-500 text-white",
      apiValue: 2,
    },
    "Settle Payment": {
      label: "Settle Payment",
      btnClass: "bg-orange-500 text-white",
      apiValue: 3,
    },
    "Payment Confirmed": {
      label: "Payment Confirmed",
      btnClass: "bg-teal-500 text-white",
      apiValue: 4,
    },
    Processing: {
      label: "Processing",
      btnClass: "bg-blue-500 text-white",
      apiValue: 5,
    },
    "Shipping Started": {
      label: "Shipping Started",
      btnClass: "bg-indigo-500 text-white",
      apiValue: 6,
    },
    "In Transit": {
      label: "In Transit",
      btnClass: "bg-indigo-600 text-white",
      apiValue: 7,
    },
    Delivered: {
      label: "Delivered",
      btnClass: "bg-green-500 text-white",
      apiValue: 8,
    },
    Cancelled: {
      label: "Cancelled",
      btnClass: "bg-red-500 text-white",
      apiValue: 9,
    },
  };
  const current = statusConfig[value] ?? statusConfig["Order Submitted"];

  /* ================= MOBILE CHECK ================= */
  const isMobile = typeof window !== "undefined" && window.innerWidth < 992;

  /* ================= OPEN ================= */
  const openAccordion = () => {
    if (!btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const dropdownHeight = 280; // approx
    const margin = 8;

    let top = rect.top - dropdownHeight - margin;
    let left = rect.left;

    if (top < margin) {
      top = rect.bottom + margin; // niche khule
    }

    if (left + 200 > window.innerWidth) {
      left = window.innerWidth - 210;
    }

    setPos({ top, left });
    setOpen(true);
  };

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* ================= STATUS CHANGE ================= */
  const handleChange = async (status: OrderStatus) => {
    try {
      setUpdating(true); // ✅ start effect

      await adminOrdersService.updateStatus({
        order_id: orderId,
        status: statusConfig[status].apiValue,
      });

      toast.success("Order status updated");

      setOpen(false);
      onUpdated();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update order status");
    } finally {
      setUpdating(false); // ✅ stop effect
    }
  };

  /* ================= STATUS LIST ================= */
  const baseStatuses: OrderStatus[] = [
    "Order Submitted",
    "Sales Agreement",
    "Awaiting Invoice",
    "Settle Payment",
    "Payment Confirmed",
    "Processing",
    "Shipping Started",
    "In Transit",
    "Delivered",
    "Cancelled",
  ];

  const allStatuses = baseStatuses;

  return (
    <>
      {/* BUTTON */}
      <button
        ref={btnRef}
        disabled={updating}
        onClick={() => (open ? setOpen(false) : openAccordion())}
        className={`
          flex items-center justify-between gap-2
          px-3 py-2 w-[158px]
          rounded-lg text-sm font-medium whitespace-nowrap
          shadow-sm border border-border
          transition cursor-pointer
          ${current?.btnClass ?? "bg-gray-400 text-white"}
          ${updating ? "opacity-70 cursor-not-allowed" : ""}
        `}
      >
        {updating ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Updating...
          </span>
        ) : (
          current.label
        )}

        {!updating && (
          <FiChevronDown
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {/* DROPDOWN */}
      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
            }}
            className="
              w-[200px]
              rounded-xl bg-white
              shadow-xl border border-border
              z-[99999999]
              overflow-hidden
            "
          >
            {allStatuses.map((status) => {
              if (!statusConfig[value]) return null;
              const currentValue =
                statusConfig[value as OrderStatus]?.apiValue ??
                statusConfig["Order Submitted"].apiValue;
              const targetValue =
                statusConfig[status]?.apiValue ??
                statusConfig["Order Submitted"].apiValue;
              const isCurrent = status === value;
              const isBackward = targetValue < currentValue;
              const isDelivered = value === "Delivered";
              const isCancelled = status === "Cancelled";
              const isFinalStage =
                value === "Delivered" || value === "Cancelled";

              const cancelBlocked =
                isCancelled &&
                currentValue >= statusConfig["Shipping Started"].apiValue;

              // const disabled =
              //   isCurrent || isBackward || isFinalStage || cancelBlocked;
              // const settleValue = statusConfig["Settle Payment"].apiValue;

              // const slipNotUploaded =
              //   !paymentSlipUrl || paymentSlipUrl.trim() === "";
              // const isAfterSettle = targetValue > settleValue;
              // const blockAfterSettle = slipNotUploaded && isAfterSettle;

              const disabled =
                isCurrent ||
                isBackward ||
                isFinalStage ||
                cancelBlocked ;
                // blockAfterSettle;
              return (
                <button
                  key={status}
                  disabled={disabled || updating}
                  onClick={() => handleChange(status)}
                  className={`
              w-full px-4 py-3
              flex justify-between items-center
              text-sm border-b last:border-b-0 border-border
              transition
              ${
                isCurrent
                  ? "bg-green-50 text-green-700 font-semibold cursor-default"
                  : disabled
                    ? "text-gray-400 cursor-not-allowed bg-gray-50"
                    : "hover:bg-gray-50 cursor-pointer"
              }
            `}
                >
                  <span>{status}</span>
                  {isCurrent && (
                    <span className="text-green-600 font-bold">✓</span>
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
