"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import { adminOrdersService, TrackingItem } from "@/api/admin/orders";
import { MdDelete } from "react-icons/md";

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

type TrackingRow = {
  id?: number; 
  date: string;
  city: string;
  status: string;
  isNew?: boolean;
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

  const [updating, setUpdating] = useState(false); 
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [rows, setRows] = useState<TrackingRow[]>([
    { date: "", city: "", status: "", isNew: true },
  ]);

  const [errors, setErrors] = useState<number[]>([]);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
const isDelivered = value === "Delivered";
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

const handleStatusClick = (status: OrderStatus) => {
  if (status === "Shipping Started") {
    setSelectedStatus(status); // save karo
    setShowTrackingModal(true);
    return;
  }

  handleChange(status);
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
const addRow = () => {
  const newRow = { date: "", city: "", status: "", isNew: true };

  setRows((prev) => {
    const lastRow = prev[prev.length - 1];

    // last row always + wali che
    return [...prev.slice(0, -1), newRow, lastRow];
  });
};

  const removeRow = (index: number) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

    const handleChangeRow = <K extends keyof TrackingRow>(
      index: number,
      field: K,
      value: TrackingRow[K]
    ) => {
      const updated = [...rows];
      updated[index][field] = value;
      setRows(updated);
    };

 const fetchTracking = async () => {
  try {
    setLoading(true);

    const res = await adminOrdersService.getTracking({
      order_id: orderId,
    });

    setRows([
      ...res.data.map((item) => ({
        id: item.id,
        date: item.tracking_date.split(" ")[0],
        city: item.city,
        status: item.status,
        isNew: false,
      })),
      { date: "", city: "", status: "", isNew: true },
    ]);

  } catch (err: any) {
    toast.error(err?.message || "Failed to fetch tracking");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (showTrackingModal) {
      fetchTracking();
    }
  }, [showTrackingModal]);

   const handleSubmit = async () => {
  if (saving) return;

  const newErrors: number[] = [];

  rows.forEach((r, i) => {
    if (r.isNew && !r.date && !r.city && !r.status) return;

    if (!r.date.trim() || !r.city.trim() || !r.status.trim()) {
      newErrors.push(i);
    }
  });

  if (newErrors.length > 0) {
    setErrors(newErrors);
    setFormError("Please fill all fields");
    return;
  }

  const hasValidRow = rows.some(
    (r) => r.date && r.city && r.status
  );

  if (!hasValidRow) {
    setFormError("Please add at least one tracking entry");
    return;
  }

  try {
    setSaving(true);

    const newRows = rows.filter(
      (r) => r.isNew && r.date && r.city && r.status
    );

    const updateRows = rows.filter(
      (r) => !r.isNew && r.id && r.date && r.city && r.status
    );

    await Promise.all([
      ...newRows.map((row) =>
        adminOrdersService.addTracking({
          order_id: orderId,
          tracking_date: row.date,
          city: row.city,
          status: row.status,
        })
      ),
      ...updateRows.map((row) =>
        adminOrdersService.updateTracking({
          id: row.id!,
          tracking_date: row.date,
          city: row.city,
          status: row.status,
        })
      ),
    ]);

  if (
  selectedStatus === "Shipping Started" &&
  statusConfig[value].apiValue < statusConfig["Shipping Started"].apiValue
) {
  await adminOrdersService.updateStatus({
    order_id: orderId,
    status: statusConfig["Shipping Started"].apiValue,
  });
}

    toast.success("Tracking updated");

    setShowTrackingModal(false); 
    onUpdated(); // refresh UI
    await fetchTracking();
    setFormError("");

  } catch (err: any) {
    toast.error(err?.message || "Failed to save");
  } finally {
    setSaving(false);
  }
};

    const handleUpdateTracking = async (row: TrackingRow) => {
        try {
          if (!row.id) return;

          const res = await adminOrdersService.updateTracking({
            id: row.id,
            tracking_date: row.date,
            city: row.city,
            status: row.status,
          });

          toast.success(res.message || "Updated successfully");

        } catch (err: any) {
          toast.error(err?.message || "Failed to update");
        }
    };

    const handleDeleteTracking = async (id: number) => {
    if (deletingId) return; // 🔥 block multiple clicks

    try {
      setDeletingId(id);

      const res = await adminOrdersService.deleteTracking({ id });

      toast.success(res.message || "Deleted successfully");

      setRows((prev) => prev.filter((r) => r.id !== id));

    } catch (err: any) {
      toast.error(err?.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

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

            const isShipping = status === "Shipping Started";

          const disabled =
            isCurrent ||
            (isBackward && !isShipping) ||
            (isFinalStage && !isShipping) || // ✅ allow even in Delivered
            cancelBlocked;
            
              return (
                <button
                  key={status}
                  disabled={
  status === "Shipping Started"
    ? false
    : (disabled || updating)
}
                onClick={() => {
  if (status === "Shipping Started") {
    handleStatusClick(status);
    return;
  }

  if (disabled || updating) return;

  handleStatusClick(status);
}}
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

      {showTrackingModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999999999]">
<div className="relative bg-white rounded-2xl shadow-xl w-[620px] px-6 py-5 mx-2">
        {isDelivered && (
  <div className="absolute inset-0 z-50 cursor-not-allowed" />
)}
          {/* HEADER */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Add Tracking Details
          </h2>

          {/* ROWS */}
      <div className="space-y-3 overflow-y-auto">
    {
      loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-[#F59E0B] rounded-full animate-spin" />
        </div>
      ) : (
          rows.map((row, index) => (
      <div key={index} className="flex items-center gap-3">

        <select
          value={row.status}
          disabled={false}
          onChange={(e) =>
            handleChangeRow(index, "status", e.target.value)
          }
          className={`h-10 px-2 border rounded-lg text-sm
            ${errors.includes(index) ? "border-red-500" : "border-gray-300"}
            ${!row.isNew ? "bg-gray-100" : ""}
          `}
        >
          <option value="">Select Status</option>
          <option value="Send">Send</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
        </select>

        <input
          type="date"
          value={row.date}
          disabled={false}
          onChange={(e) =>
            handleChangeRow(index, "date", e.target.value)
          }
          className={`h-10 px-3 border rounded-lg text-sm
            ${errors.includes(index) ? "border-red-500" : "border-gray-300"}
            ${!row.isNew ? "bg-gray-100" : ""}
          `}
        />

        <input
          type="text"
          value={row.city}
          placeholder="City"
          disabled={false}
          onChange={(e) =>
            handleChangeRow(index, "city", e.target.value)
          }
          className={`h-10 px-3 border rounded-lg text-sm
            ${errors.includes(index) ? "border-red-500" : "border-gray-300"}
            ${!row.isNew ? "bg-gray-100" : ""}
          `}
        />

        {!row.isNew ? (
          <button
          onClick={() => handleDeleteTracking(row.id!)}
          disabled={deletingId === row.id}
          className="text-red-500 text-xl cursor-pointer"
        >
          {deletingId === row.id ? (
            <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            <MdDelete size={24} />
          )}
        </button>
        ) : index === rows.length - 1 ? (
          <button
            onClick={addRow}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F59E0B] text-white text-lg"
          >
            +
          </button>
        ) : (
          <button
            onClick={() => removeRow(index)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-100 text-red-600 text-lg"
          >
            −
          </button>
        )}

      </div>
      ))
      )
      }
      </div>
        {formError && (
          <div className="text-red-500 text-sm mb-2 text-center mt-3">
            {formError}
          </div>
        )}
          {/* FOOTER */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setShowTrackingModal(false)}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>

            <button
          onClick={handleSubmit}
          disabled={saving}
          className={`px-5 py-2 rounded-lg text-white cursor-pointer
            ${saving 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]"
            }
          `}
        >
          {saving ? "Saving..." : "Submit"}
        </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
