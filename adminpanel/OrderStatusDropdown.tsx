"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown, FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import { adminOrdersService } from "@/api/admin/orders";
import { IoClose } from "react-icons/io5";
import { sendSMS } from "@/api/sms/sendSMS";
import { useSettings } from "@/contexts/SettingsContext";
import DeliveryMap from "./DeliveryMap";
import { BiMinus } from "react-icons/bi";
import { getLatLngFromCity } from "@/api/admin/googleGeocode";

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
  phone: string;
  value: OrderStatus;
  orderId: number;
  orderType: "Checkout" | "Bidding";
  paymentSlipStatus: "Pending" | "Approve" | "Decline";
  paymentSlipUrl?: string;
  onUpdated: () => void;
  trackingViewOnly?: boolean;
};

type TrackingRow = {
  id?: number;
  date: string;
  city: string;
  isNew?: boolean;
  lat?: number;
  lng?: number;
};

export default function OrderStatusDropdown({
  phone,
  value,
  orderId,
  orderType,
  onUpdated,
  trackingViewOnly = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const { companyName } = useSettings();
  const [updating, setUpdating] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [rows, setRows] = useState<TrackingRow[]>([
    { date: "", city: "", isNew: true },
  ]);

  const [errors, setErrors] = useState<number[]>([]);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"form" | "table" | "map">("form");
  const todayDate = new Date().toISOString().split("T")[0];
  const [trackingLocked, setTrackingLocked] = useState(false);
  const [hideTrackingForm, setHideTrackingForm] = useState(true);
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

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      if (!btnRef.current || !dropdownRef.current) {
        return;
      }

      const rect = btnRef.current.getBoundingClientRect();

      const dropdownHeight = dropdownRef.current.offsetHeight;

      const dropdownWidth = dropdownRef.current.offsetWidth;

      const margin = 8;

      let top = rect.bottom + margin;

      // niche space na hoy
      if (top + dropdownHeight > window.innerHeight - 10) {
        top = rect.top - dropdownHeight - margin;
      }

      // hju upar cut thay to top safe
      if (top < 10) {
        top = 10;
      }

      let left = rect.left;

      // right overflow
      if (left + dropdownWidth > window.innerWidth - 10) {
        left = window.innerWidth - dropdownWidth - 10;
      }

      // left overflow
      if (left < 10) {
        left = 10;
      }

      setPos({ top, left });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);

    return () => window.removeEventListener("resize", updatePosition);
  }, [open]);

  /* ================= STATUS CHANGE ================= */
  const handleChange = async (status: OrderStatus) => {
    try {
      setUpdating(true);

      await adminOrdersService.updateStatus({
        order_id: orderId,
        status: statusConfig[status].apiValue,
      });

      if (status === "Settle Payment") {
        await sendSMS({
          phone,
          type: "settle_payment",
          companyName: companyName || "McFarland Equipment Sales & Auctions",
          orderType,
        });
      }

      toast.success("Order status updated");

      setOpen(false);
      onUpdated();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusClick = (status: OrderStatus) => {
    if (status === "In Transit") {
      setSelectedStatus(status);
      setTrackingLocked(false);
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
    setRows((prev) => [
      ...prev,
      {
        date: "",
        city: "",
        isNew: true,
      },
    ]);
  };
  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
    setFormError("");
  };

  const handleChangeRow = <K extends keyof TrackingRow>(
    index: number,
    field: K,
    value: TrackingRow[K],
  ) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const fetchTracking = async () => {
    try {
      const res = await adminOrdersService.getTracking({
        order_id: orderId,
      });

      const trackingRows = res.data.map((item) => ({
  id: item.id,
  date: item.tracking_date.split(" ")[0],
  city: item.city,
  lat: Number(item.lat),
  lng: Number(item.lng),
  isNew: false,
}));

setRows(trackingRows);

// ================= CHECK UPDATED =================

const hasUpdatedTracking = res.data.some(
  (item) => item.is_update === true
);

// true hoy to hide
// false hoy to show

setHideTrackingForm(hasUpdatedTracking);

    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  useEffect(() => {
    if (showTrackingModal) {
      fetchTracking();
    }
  }, [showTrackingModal]);

const handleSubmit = async () => {
  if (saving) return;

  try {
    setSaving(true);

    const validRows = await Promise.all(
    rows
    .filter((row) => row.date && row.city)
    .map(async (row) => {

      // ================= GET LAT LNG =================

      const coords =
        await getLatLngFromCity(
          row.city
        );

      return {
        ...row,
        lat: coords?.lat,
        lng: coords?.lng,
      };
    })
);

    // ================= CHECK EXISTING =================

    const hasExistingTracking = validRows.some(
      (row) => row.id
    );

    // ================= FIRST TIME ADD =================

    if (!hasExistingTracking) {

      await adminOrdersService.addTracking({
        trackings: validRows.map((row) => ({
          order_id: orderId,
          tracking_date: row.date,
          city: row.city,
           lat: row.lat,
          lng:  row.lng,
        })),
      });

    }

    // ================= UPDATE =================

    else {

      const updates = validRows
        .filter((row) => row.id)
        .map((row) => ({
          id: row.id!,
          tracking_date: row.date,
          city: row.city,
          lat: row.lat,
          lng: row.lng,
        }));

      const new_trackings = validRows
        .filter((row) => !row.id)
        .map((row) => ({
          order_id: orderId,
          tracking_date: row.date,
          city: row.city,
          lat: row.lat,
          lng: row.lng,
        }));

      await adminOrdersService.updateTracking({
        updates,
        new_trackings,
      });

    }

    // ================= STATUS UPDATE =================

    if (
      selectedStatus &&
      statusConfig[value].apiValue <
        statusConfig[selectedStatus].apiValue
    ) {

      await adminOrdersService.updateStatus({
        order_id: orderId,
        status:
          statusConfig[selectedStatus]
            .apiValue,
      });

    }

    await fetchTracking();

    setTrackingLocked(true);

    setActiveTab("map");

    toast.success(
      "Tracking saved successfully"
    );

  } catch (err: any) {

    toast.error(
      err?.message ||
      "Failed to save tracking"
    );

  } finally {

    setSaving(false);

  }
};

 return (
    <>
      {!trackingViewOnly ? (
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
      ) : (
        <button
          onClick={async () => {
            setActiveTab("map");

            setShowTrackingModal(true);

            await fetchTracking();
          }}
          className="
            text-blue-500
            hover:text-blue-600
            transition
            cursor-pointer
          "
        >
          <FiEye size={18} />
        </button>
      )}

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
              max-h-[calc(100vh-120px)]
              overflow-y-auto
              overscroll-contain
              custom-scrollbar
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
              const isCancelled = status === "Cancelled";
              const isFinalStage =
                value === "Delivered" || value === "Cancelled";

              const cancelBlocked =
                isCancelled &&
                currentValue >= statusConfig["Shipping Started"].apiValue;

              const isTrackingStatus = status === "In Transit";

              const trackingBlocked =
                isTrackingStatus &&
                (value === "Delivered" || value === "Cancelled");

              const disabled =
                isCurrent ||
                trackingBlocked ||
                (isBackward && !isTrackingStatus) ||
                (isFinalStage && !isTrackingStatus) ||
                cancelBlocked;

              return (
                <button
                  key={status}
                  disabled={disabled || updating || trackingBlocked}
                  onClick={() => {
                    if (isTrackingStatus && !trackingBlocked) {
                      setSelectedStatus(status);

                      setActiveTab(status === "In Transit" ? "form" : "map");

                      setShowTrackingModal(true);

                      setOpen(false);

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

      {/* ================= TRACKING MODAL ================= */}
      {showTrackingModal && (
        <div className="fixed inset-0 z-[999999999] bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-2 sm:p-3">
          <div className="relative bg-white w-full max-w-[940px] h-[85vh] sm:h-[82vh] rounded-[24px] shadow-2xl overflow-hidden flex flex-col">
            {/* ================= HEADER ================= */}
            <div className="border-b border-gray-100 px-4 sm:px-5 py-3 sm:py-4 shrink-0">
              <button
                onClick={() => {
                  setShowTrackingModal(false);
                  onUpdated();
                }}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer"
              >
                <IoClose size={18} className="text-gray-700" />
              </button>
              <h2 className="text-[22px] sm:text-[28px] font-bold text-[#1E293B] leading-tight">
                Tracking Management
              </h2>
            </div>

            {/* ================= TABS ================= */}
            <div className="px-4 sm:px-5 pt-2 shrink-0">
              <div className="flex items-center gap-4 border-b border-gray-100 overflow-x-auto no-scrollbar">
              {!hideTrackingForm && (
                  <button
                    onClick={() => setActiveTab("form")}
                    className={`
                  relative pb-2.5 text-[14px] font-semibold whitespace-nowrap transition cursor-pointer
                  ${
                    activeTab === "form"
                      ? "text-[#F59E0B]"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
                  >
                    Add Tracking
                    {activeTab === "form" && (
                      <div className="absolute left-0 bottom-0 h-[2.5px] w-full rounded-full bg-[#F59E0B]" />
                    )}
                  </button>
                )}

                <button
                  onClick={() => setActiveTab("map")}
                  className={`
                  relative pb-2.5 text-[14px] font-semibold whitespace-nowrap transition cursor-pointer
                  ${
                    activeTab === "map"
                      ? "text-[#F59E0B]"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
                >
                  Delivery Map
                  {activeTab === "map" && (
                    <div className="absolute left-0 bottom-0 h-[2.5px] w-full rounded-full bg-[#F59E0B]" />
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab("table")}
                  className={`
                  relative pb-2.5 text-[14px] font-semibold whitespace-nowrap transition cursor-pointer
                  ${
                    activeTab === "table"
                      ? "text-[#F59E0B]"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
                >
                  Tracking History
                  {activeTab === "table" && (
                    <div className="absolute left-0 bottom-0 h-[2.5px] w-full rounded-full bg-[#F59E0B]" />
                  )}
                </button>

              </div>
            </div>

            {/* ================= BODY ================= */}
            <div className="flex-1 overflow-hidden">
              {/* ======================= FORM TAB ======================== */}

              {activeTab === "form" && (
              // {activeTab === "form" && !trackingViewOnly && (
                <div className="h-full flex flex-col overflow-hidden">
                  {/* ================= TOP BAR ================= */}

                  <div
                    className="
                sticky top-0 z-20
                bg-white
                border-b border-gray-100
                px-4 sm:px-5 py-3
                shrink-0
              "
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[14px] font-semibold text-[#1E293B]">
                          Tracking Entries ({rows.length})
                        </div>

                        <div className="text-[12px] text-gray-500 mt-0.5">
                          Add shipment tracking updates
                        </div>
                      </div>
{!trackingLocked && (

                      <button
                        onClick={addRow}
                        className="
          h-9 px-3 rounded-xl
          bg-[#F59E0B]
          hover:bg-[#df9300]
          text-white text-[13px] font-medium
          flex items-center gap-1.5
          transition
          shrink-0
        "
                      >
                        <span className="text-[18px] leading-none">+</span>
                        Add
                      </button>
)}
                    </div>
                  </div>

                  {/* ================= SCROLL AREA ================= */}

                  <div
                    className="
      flex-1 overflow-y-auto
      px-4 sm:px-5 py-3
      space-y-3
    "
                  >
                    {rows.filter(Boolean).map((row, index) => (
                      <div
                        key={index}
                        className="
          border border-gray-200
          rounded-2xl
          bg-white
          p-3
        "
                      >
                        {/* DESKTOP */}

                        <div className="hidden md:grid md:grid-cols-12 gap-2 items-end">
                          {/* DATE */}

                          <div className="md:col-span-4">
                            <label className="text-[11px] text-gray-600 block mb-1">
                              Date
                            </label>

                            <input
                              type="date"
                              // disabled={!row.isNew}
                              disabled={trackingLocked}
                              min={todayDate}
                              value={row.date}
                              onChange={(e) =>
                                handleChangeRow(index, "date", e.target.value)
                              }
                              className={`
                h-10 rounded-xl border bg-white
                px-3 text-[13px] w-full
                focus:outline-none
                focus:ring-1 focus:ring-[#F59E0B]/20
                ${errors.includes(index) ? "border-red-500" : "border-gray-300"}
              `}
                            />
                          </div>

                          {/* CITY */}

                          <div className="md:col-span-7">
                            <label className="text-[11px] text-gray-600 block mb-1">
                              City
                            </label>

                            <input
                              type="text"
                              // disabled={!row.isNew}
                              disabled={trackingLocked}
                              value={row.city}
                              placeholder="Ex: Dallas, Texas, USA"
                              onChange={(e) =>
                                handleChangeRow(index, "city", e.target.value)
                              }
                              className={`
                h-10 rounded-xl border bg-white
                px-3 text-[13px] w-full
                focus:outline-none
                focus:ring-1 focus:ring-[#F59E0B]/20
                ${errors.includes(index) ? "border-red-500" : "border-gray-300"}
              `}
                            />
                          </div>

                          {/* DELETE */}

                         {row.isNew && !row.id && !trackingLocked && (
                            <div className="md:col-span-1">
                              <button
                                type="button"
                                onClick={() => removeRow(index)}
                                className="
                  h-10 w-10 rounded-xl
                  border border-red-200
                  text-red-500
                  hover:bg-red-50
                  flex items-center justify-center
                  transition
                "
                              >
                                <BiMinus size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* ERROR */}

                    {formError && (
                      <div className="text-[13px] text-red-500 font-medium">
                        {formError}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ====================== TABLE TAB ======================== */}

              {activeTab === "table" && (
                <div className="h-full overflow-y-auto px-4 sm:px-5 py-3">
                  <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                    {/* DESKTOP TABLE */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full min-w-[700px]">
                        <thead className="bg-[#FFF8EA] border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#334155]">
                              #
                            </th>

                            <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#334155]">
                              Date
                            </th>

                            <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#334155]">
                              City
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {rows.filter((r) => !r.isNew).length === 0 ? (
                            <tr>
                              <td
                                colSpan={4}
                                className="py-16 text-center text-gray-400 text-sm"
                              >
                                No tracking records available
                              </td>
                            </tr>
                          ) : (
                            rows
                              .filter((r) => !r.isNew)
                              .map((row, index) => (
                                <tr
                                  key={row.id}
                                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                                >
                                  <td className="px-4 py-3 text-[13px] text-gray-700">
                                    {index + 1}
                                  </td>
                                  <td className="px-4 py-3 text-[13px] text-gray-700">
                                    {row.date}
                                  </td>

                                  <td className="px-4 py-3 text-[13px] text-gray-700">
                                    {row.city}
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* MOBILE CARD VIEW */}
                    <div className="md:hidden p-2.5 space-y-2.5">
                      {rows.filter((r) => !r.isNew).length === 0 ? (
                        <div className="py-12 text-center text-sm text-gray-400">
                          No tracking records available
                        </div>
                      ) : (
                        rows
                          .filter((r) => !r.isNew)
                          .map((row, index) => (
                            <div
                              key={row.id}
                              className="border border-gray-200 rounded-2xl p-3 bg-gray-50"
                            >
                              <div className="mt-3 space-y-2">
                                <div className="flex justify-between gap-3">
                                  <span className="text-[11px] text-gray-500">
                                    Date
                                  </span>

                                  <span className="text-[13px] font-medium text-gray-700">
                                    {row.date}
                                  </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                  <span className="text-[11px] text-gray-500">
                                    City
                                  </span>

                                  <span className="text-[13px] font-medium text-gray-700">
                                    {row.city}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>

                    {/* PAGINATION */}
                    <div className="border-t border-gray-100 px-3 py-2.5 flex items-center justify-center sm:justify-between flex-wrap sm:flex-nowrap gap-2 bg-white">
                      <div className="text-[13px] text-gray-500">
                        1 – {rows.filter((r) => !r.isNew).length} of{" "}
                        {rows.filter((r) => !r.isNew).length} results
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          className="
                          h-8 px-2 rounded-lg border border-gray-200
                          text-[13px] text-gray-600 bg-white
                          focus:outline-none
                        "
                        >
                          <option>10</option>
                          <option>25</option>
                          <option>50</option>
                        </select>

                        <div className="flex items-center gap-1">
                          <button
                            className="
                            w-8 h-8 rounded-lg border border-gray-200
                            flex items-center justify-center
                            text-gray-400 hover:bg-gray-50
                          "
                          >
                            «
                          </button>

                          <button
                            className="
                            w-8 h-8 rounded-lg border border-gray-200
                            flex items-center justify-center
                            text-gray-400 hover:bg-gray-50
                          "
                          >
                            ‹
                          </button>

                          <div className="px-2 text-[13px] font-medium text-gray-700">
                            1 / 1
                          </div>

                          <button
                            className="
                            w-8 h-8 rounded-lg border border-gray-200
                            flex items-center justify-center
                            text-gray-400 hover:bg-gray-50
                          "
                          >
                            ›
                          </button>

                          <button
                            className="
                            w-8 h-8 rounded-lg border border-gray-200
                            flex items-center justify-center
                            text-gray-400 hover:bg-gray-50
                          "
                          >
                            »
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

             {activeTab === "map" && (
  <div className="h-full p-2 md:p-4 relative">
    {rows.filter((r) => !r.isNew && r.lat && r.lng).length > 0 ? (
      <DeliveryMap
        trackingData={rows
          .filter((r) => !r.isNew)
          .map((r) => ({
            city: r.city,
            date: r.date,
            lat: r.lat,
            lng: r.lng,
          }))}
      />
    ) : (
      <div
        className="
          h-full flex items-center justify-center
          border border-gray-200 rounded-2xl
          bg-white text-gray-400 text-sm
        "
      >
        No tracking map data available
      </div>
    )}
  </div>
)}
            </div>

            {/* ================= FOOTER ================= */}
            <div className="border-t border-gray-100 px-4 sm:px-5 py-3 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowTrackingModal(false)}
                className="
                h-10 px-4 rounded-xl border border-gray-300 cursor-pointer
                text-[13px] font-medium text-gray-700
                hover:bg-gray-100 transition
              "
              >
                Cancel
              </button>
             {activeTab === "form" &&
 !trackingLocked &&
 !hideTrackingForm && (
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className={`
                  h-10 px-5 rounded-xl text-[13px] font-semibold text-white transition cursor-pointer
                  ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#F59E0B] to-[#FFB800] hover:opacity-90"
                  }
                `}
                >
                  {saving ? "Saving..." : "Save Tracking"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
