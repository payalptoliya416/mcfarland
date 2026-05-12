"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import { adminOrdersService } from "@/api/admin/orders";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { sendSMS } from "@/api/sms/sendSMS";
import { useSettings } from "@/contexts/SettingsContext";
// import {useJsApiLoader} from "@react-google-maps/api";
// import CommonGoogleMap from "./CommonGoogleMap";

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
  onUpdated,
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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "table" | "map">("form");
  // const { isLoaded } = useJsApiLoader({googleMapsApiKey:
  //     process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  // });
  // const [directions, setDirections] = useState<any>(null);
  // const [markers, setMarkers] = useState<any[]>([]);
  // const [showMobileTracking, setShowMobileTracking] =useState(true);
  const todayDate = new Date().toISOString().split("T")[0];

  /* ================= STATUS CONFIG ================= */
  const statusConfig: Record<OrderStatus,{ label: string; btnClass: string; apiValue: number }
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

//  const generateRoute = async () => {
//   try {

//     if (markers.length < 2) return;

//     const sortedMarkers = [...markers].sort(
//       (a, b) =>
//         new Date(a.date).getTime() -
//         new Date(b.date).getTime()
//     );

//     const origin = {
//       lat: Number(sortedMarkers[0].lat),
//       lng: Number(sortedMarkers[0].lng),
//     };

//     const destination = {
//       lat: Number(
//         sortedMarkers[sortedMarkers.length - 1].lat
//       ),
//       lng: Number(
//         sortedMarkers[sortedMarkers.length - 1].lng
//       ),
//     };

//     const waypoints = sortedMarkers
//       .slice(1, -1)
//       .map((item) => ({
//         location: {
//           lat: Number(item.lat),
//           lng: Number(item.lng),
//         },
//         stopover: true,
//       }));

//     const directionsService =
//       new google.maps.DirectionsService();

//     const result =
//       await directionsService.route({
//         origin,
//         destination,
//         waypoints,
//         optimizeWaypoints: false,
//         travelMode:
//           google.maps.TravelMode.DRIVING,
//       });

//     setDirections(result);

//   } catch (err) {
//     console.log("Route Error:", err);
//   }
// };

  // const validateLocation = async (
  //   city: string
  // ) => {

  //   try {

  //     const geocoder =
  //       new google.maps.Geocoder();

  //     const result =
  //       await geocoder.geocode({
  //         address: city,
  //       });

  //     if (
  //       !result.results ||
  //       result.results.length === 0
  //     ) {
  //       return null;
  //     }

  //     return result.results[0]
  //       .formatted_address;

  //   } catch {
  //     return null;
  //   }

  // };

// const generateMarkers = async () => {

//   const geocoder = new google.maps.Geocoder();

//   const validRows = rows
//     .filter((r) => r.city)
//     .sort(
//       (a, b) =>
//         new Date(a.date).getTime() -
//         new Date(b.date).getTime()
//     );

//   const locations = await Promise.all(

//     validRows.map(async (row, index) => {

//       const res = await geocoder.geocode({
//         address: row.city,
//       });

//       const loc =
//         res.results?.[0]?.geometry.location;

//       const lat = loc?.lat();
//       const lng = loc?.lng();

//       // 🔥 rows ma pan set karo
//       return {
//         ...row,
//         index,
//         lat: Number(lat),
//         lng: Number(lng),
//       };
//     })

//   );

//   // 🔥 markers set
//   setMarkers(locations.filter((x) => x.lat && x.lng));

//   // 🔥 rows update karo
//   setRows((prev) =>
//     prev.map((r) => {
//       const found = locations.find(
//         (l) =>
//           l.city === r.city &&
//           l.date === r.date
//       );

//       if (found) {
//         return {
//           ...r,
//           lat: found.lat,
//           lng: found.lng,
//         };
//       }

//       return r;
//     })
//   );
// };

//   useEffect(() => {

//   if (activeTab !== "map") return;

//   generateMarkers();

// }, [activeTab, rows]);

// useEffect(() => {

//   if (markers.length >= 2) {
//     generateRoute();
//   }

// }, [markers]);

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

      if (
        !btnRef.current ||
        !dropdownRef.current
      ) {
        return;
      }

      const rect =
        btnRef.current.getBoundingClientRect();

      const dropdownHeight =
        dropdownRef.current.offsetHeight;

      const dropdownWidth =
        dropdownRef.current.offsetWidth;

      const margin = 8;

      let top =
        rect.bottom + margin;

      // niche space na hoy
      if (
        top + dropdownHeight >
        window.innerHeight - 10
      ) {

        top =
          rect.top -
          dropdownHeight -
          margin;

      }

      // hju upar cut thay to top safe
      if (top < 10) {
        top = 10;
      }

      let left = rect.left;

      // right overflow
      if (
        left + dropdownWidth >
        window.innerWidth - 10
      ) {

        left =
          window.innerWidth -
          dropdownWidth -
          10;

      }

      // left overflow
      if (left < 10) {
        left = 10;
      }

      setPos({ top, left });

    };

    updatePosition();

    window.addEventListener(
      "resize",
      updatePosition
    );

    return () =>
      window.removeEventListener(
        "resize",
        updatePosition
      );

  }, [open]);

  /* ================= STATUS CHANGE ================= */
  const handleChange = async (status: OrderStatus) => {
    try {
      setUpdating(true); 

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
      setUpdating(false); 
    }
  };

  const handleStatusClick = (status: OrderStatus) => {
    if (status === "Shipping Started") {
      setSelectedStatus(status);
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
  const newRow = {
    date: "",
    city: "",
    isNew: true,
  };

  setRows((prev) => [
    ...prev,
    newRow,
  ]);
};

 const removeRow = (index: number) => {
  setRows((prev) => {
    const updated = [...prev];

    updated.splice(index, 1);

    if (updated.length === 0) {
      return [
        {
          date: "",
          city: "",
          isNew: true,
        },
      ];
    }

    return updated;
  });
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
    lat: Number(item.lat),
    lng: Number(item.lng),
    isNew: false,
  })),
        { date: "", city: "", isNew: true },
      ]);

    } catch (err: any) {
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showTrackingModal) {
      fetchTracking();
    }
  }, [showTrackingModal]);

//   const handleSubmit = async () => {
//   if (saving) return;

//   const newErrors: number[] = [];

//   rows.forEach((r, i) => {
//     if (r.isNew && !r.date && !r.city) return;

//     if (!r.date.trim() || !r.city.trim()) {
//       newErrors.push(i);
//     }
//   });

//   if (newErrors.length > 0) {
//     setErrors(newErrors);
//     setFormError("Please fill all fields");
//     return;
//   }

//   const hasValidRow = rows.some(
//     (r) => r.date && r.city
//   );

//   if (!hasValidRow) {
//     setFormError("Please add at least one tracking entry");
//     return;
//   }

//   try {
    
//   setSaving(true);
//   // await generateMarkers();

//     const newRows = rows.filter(
//       (r) => r.isNew && r.date && r.city 
//     );

//     const updateRows = rows.filter(
//       (r) => !r.isNew && r.id && r.date && r.city
//     );
    
//     for (const row of [
//       ...newRows,
//       ...updateRows,
//     ]) {

//   const formatted =
//     await validateLocation(
//       row.city
//     );

//   if (!formatted) {

//     toast.error(
//       `Invalid location: ${row.city}`
//     );

//     setSaving(false);

//     return;
//   }
// }
//     await Promise.all([
//   ...newRows.map((row) =>
//     adminOrdersService.addTracking({
//       order_id: orderId,
//       tracking_date: row.date,
//       city: row.city,
//       lat: row.lat,
//       lng: row.lng,
//     })  
//   ),

//   ...updateRows.map((row) =>
//     adminOrdersService.updateTracking({
//       id: row.id!,
//       tracking_date: row.date,
//       city: row.city,
//       lat: row.lat,
//       lng: row.lng,
//     })
//   ),
// ]);

//   if (
//   selectedStatus === "Shipping Started" &&
//   statusConfig[value].apiValue < statusConfig["Shipping Started"].apiValue
//   ) {
//     await adminOrdersService.updateStatus({
//       order_id: orderId,
//       status: statusConfig["Shipping Started"].apiValue,
//     });

//     try {

//       await sendSMS({
//         phone,
//         type: "shipping_started" as any,
//         companyName:
//           companyName ||
//         "McFarland Equipment Sales & Auctions",
//       });

//     } catch (smsError) {
//     }
//   }
    
//    toast.success(
//   "Tracking updated successfully"
// );

// setActiveTab("table");

//     await fetchTracking();
//     setShowTrackingModal(true);
//     setFormError("");

//   } catch (err: any) {
//     toast.error(err?.message || "Failed to save");
//   } finally {
//     setSaving(false);
//   }
//   };
const handleSubmit = async () => {

  if (saving) return;

  const newErrors: number[] = [];

  rows.forEach((r, i) => {

    if (r.isNew && !r.date && !r.city) return;

    if (!r.date.trim() || !r.city.trim()) {
      newErrors.push(i);
    }

  });

  if (newErrors.length > 0) {

    setErrors(newErrors);
    setFormError("Please fill all fields");

    return;

  }

  const hasValidRow = rows.some(
    (r) => r.date && r.city
  );

  if (!hasValidRow) {

    setFormError(
      "Please add at least one tracking entry"
    );

    return;

  }

  try {

    setSaving(true);

    const newRows = rows.filter(
      (r) =>
        r.isNew &&
        r.date &&
        r.city
    );

    const updateRows = rows.filter(
      (r) =>
        !r.isNew &&
        r.id &&
        r.date &&
        r.city
    );

    // ================= ADD TRACKING =================

    await Promise.all([

      ...newRows.map((row) =>
        adminOrdersService.addTracking({

          order_id: orderId,
          tracking_date: row.date,
          city: row.city,
          status: "surat",
          // Google map remove kari didhu che
          // lat: null,
          // lng: null,

        })
      ),

      ...updateRows.map((row) =>
        adminOrdersService.updateTracking({

          id: row.id!,
          tracking_date: row.date,
          city: row.city,
          status: "surat",
          // Google map remove kari didhu che
          // lat: null,
          // lng: null,

        })
      ),

    ]);

    // ================= STATUS UPDATE =================

    if (

      selectedStatus ===
        "Shipping Started" &&

      statusConfig[value].apiValue <
        statusConfig["Shipping Started"]
          .apiValue

    ) {

      await adminOrdersService.updateStatus({

        order_id: orderId,

        status:
          statusConfig[
            "Shipping Started"
          ].apiValue,

      });

      try {

        await sendSMS({

          phone,

          type:
            "shipping_started" as any,

          companyName:
            companyName ||
            "McFarland Equipment Sales & Auctions",

        });

      } catch (smsError) {}

    }

    toast.success(
      "Tracking updated successfully"
    );

    setActiveTab("table");

    await fetchTracking();

    setShowTrackingModal(true);

    setFormError("");

  } catch (err: any) {

    toast.error(
      err?.message || "Failed to save"
    );

  } finally {

    setSaving(false);

  }

};
   const handleDeleteTracking = async (id: number) => {
    if (deletingId) return;

    try {
      setDeletingId(id);

      const res = await adminOrdersService.deleteTracking({ id });

      toast.success(res.message || "Deleted successfully");

      setRows((prev) => {
        const filtered = prev.filter((r) => r.id !== id);

        if (filtered.length === 0) {
          return [
            {
              date: "",
              city: "",
              isNew: true,
            },
          ];
        }

        return filtered;
      });

    } catch (err: any) {
      toast.error(err?.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
   };

  return (
    <>
    
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

            const isShipping = status === "Shipping Started";

          const disabled =
            isCurrent ||
            (isBackward && !isShipping) ||
            (isFinalStage && !isShipping) || 
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

              {/* <button
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
              </button> */}
            </div>

          </div>

          {/* ================= BODY ================= */}
          <div className="flex-1 overflow-hidden">

            {/* ======================= FORM TAB ======================== */}

            {activeTab === "form" && (

              <div className="h-full overflow-y-auto px-4 sm:px-5 py-3">

                {loading ? (

                  <div className="flex items-center justify-center h-[220px]">
                    <div className="w-7 h-7 border-[3px] border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
                  </div>

                ) : (

                  <div className="space-y-2.5">

                    {/* ================= TOP ACTION ================= */}
                    <div className="flex items-center justify-between">

                      <div className="text-[13px] font-semibold text-[#1E293B]">
                        Tracking Entries ({rows.length})
                      </div>

                      <button
                        onClick={addRow}
                        className="
                          h-9 px-3 rounded-xl
                          bg-[#F59E0B] hover:bg-[#df9300]
                          text-white text-[13px] font-medium
                          flex items-center gap-1.5
                          transition
                        "
                      >
                        <span className="text-[18px] leading-none">+</span>
                        Add
                      </button>

                    </div>

                    {/* ================= LIST ================= */}
                    <div className="space-y-2">

                    {rows.filter(Boolean).map((row, index) => (

                        <div
                          key={index}
                          className="
                            border border-gray-200
                            rounded-2xl
                            bg-white
                            p-2.5
                          "
                        >

                          {/* DESKTOP */}
                          <div className="hidden md:grid md:grid-cols-12 gap-2 items-end">

                            {/* NUMBER */}
                            <div className="md:col-span-1">

                              <div
                                className="
                                  h-10 rounded-xl
                                  bg-[#FFF4DE]
                                  text-[#F59E0B]
                                  text-[13px] font-semibold
                                  flex items-center justify-center
                                "
                              >
                                #{index + 1}
                              </div>

                            </div>

                            {/* DATE */}
                            <div className="md:col-span-4">

                              <label className="text-[11px] text-gray-600 block mb-1">
                                Date
                              </label>

                              <input
                                type="date"
                                min={todayDate}
                                value={row.date}
                                onChange={(e) =>
                                  handleChangeRow(index, "date", e.target.value)
                                }
                                className={`
                                  h-10 rounded-xl border bg-white
                                  px-3 text-[13px] w-full
                                  focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20
                                  ${
                                    errors.includes(index)
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  }
                                `}
                              />

                            </div>

                            {/* CITY */}
                            <div className="md:col-span-5">

                              <label className="text-[11px] text-gray-600 block mb-1">
                                City
                              </label>

                              <input
                                type="text"
                                value={row.city}
                                placeholder="Ex: Dallas, Texas, USA"
                                onChange={(e) =>
                                  handleChangeRow(index, "city", e.target.value)
                                }
                                className={`
                                  h-10 rounded-xl border bg-white
                                  px-3 text-[13px] w-full
                                  focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20
                                  ${
                                    errors.includes(index)
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  }
                                `}
                              />

                            </div>

                            {/* DELETE */}
                            <div className="md:col-span-1">

                              <button
                                onClick={() => {
                                  if (!row.isNew && row.id) {
                                    handleDeleteTracking(row.id);
                                  } else {
                                    removeRow(index);
                                  }
                                }}
                                className="
                                  h-10 w-full rounded-xl cursor-pointer
                                  bg-red-50 hover:bg-red-100
                                  flex items-center justify-center
                                  transition
                                "
                              >
                                <MdDelete
                                  size={24}
                                  className="text-red-500"
                                />
                              </button>

                            </div>

                          </div>

                          {/* MOBILE */}
                          <div className="md:hidden space-y-2.5">

                            <div className="flex items-center justify-between">

                              <div
                                className="
                                  h-8 px-3 rounded-lg
                                  bg-[#FFF4DE]
                                  text-[#F59E0B]
                                  text-[12px] font-semibold
                                  flex items-center
                                "
                              >
                                Tracking #{index + 1}
                              </div>

                              <button
                                onClick={() => {
                                  if (!row.isNew && row.id) {
                                    handleDeleteTracking(row.id);
                                  } else {
                                    removeRow(index);
                                  }
                                }}
                                className="
                                  w-8 h-8 rounded-lg cursor-pointer
                                  bg-red-50 hover:bg-red-100
                                  flex items-center justify-center
                                "
                              >
                                <MdDelete
                                  size={15}
                                  className="text-red-500"
                                />
                              </button>

                            </div>

                            <div className="space-y-2">
                              <input
                                type="date"
                                min={todayDate}
                                value={row.date}
                                onChange={(e) =>
                                  handleChangeRow(index, "date", e.target.value)
                                }
                                className={`
                                  h-10 rounded-xl border bg-white
                                  px-3 text-[13px] w-full
                                  focus:outline-none
                                  ${
                                    errors.includes(index)
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  }
                                `}
                              />

                              <input
                                type="text"
                                value={row.city}
                                placeholder="Enter City"
                                onChange={(e) =>
                                  handleChangeRow(index, "city", e.target.value)
                                }
                                className={`
                                  h-10 rounded-xl border bg-white
                                  px-3 text-[13px] w-full
                                  focus:outline-none
                                  ${
                                    errors.includes(index)
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  }
                                `}
                              />

                            </div>

                          </div>

                        </div>

                      ))}

                    </div>

                    {/* ERROR */}
                    {formError && (
                      <div className="text-[13px] text-red-500 font-medium">
                        {formError}
                      </div>
                    )}

                  </div>

                )}

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

                          <th className="px-4 py-3 text-center text-[13px] font-semibold text-[#334155]">
                            Actions
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {rows.filter((r) => !r.isNew).length === 0 ? (

                          <tr>
                            <td
                              colSpan={5}
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

                                <td className="px-4 py-3">

                                  <div className="flex justify-center">

                                    <button
                                      onClick={() =>
                                        row.id && handleDeleteTracking(row.id)
                                      }
                                      className="
                                        w-8 h-8 rounded-lg cursor-pointer
                                        bg-red-50 hover:bg-red-100
                                        flex items-center justify-center
                                        transition
                                      "
                                    >
                                      <MdDelete
                                        size={15}
                                        className="text-red-500"
                                      />
                                    </button>

                                  </div>

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

                            <div className="flex items-start justify-between">
                              <button
                                onClick={() =>
                                  row.id && handleDeleteTracking(row.id)
                                }
                                className="
                                  w-8 h-8 rounded-lg cursor-pointer
                                  bg-red-50 hover:bg-red-100
                                  flex items-center justify-center
                                "
                              >
                                <MdDelete
                                  size={15}
                                  className="text-red-500"
                                />
                              </button>

                            </div>

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

          {/* {activeTab === "map" && (

            <div className="h-full p-2 md:p-4 relative">
        {!isLoaded ? (

          <div className="flex items-center justify-center h-full">
            Loading Map...
          </div>

        ) : markers.length < 2 ? (

          <div className="flex items-center justify-center h-full text-gray-500">
            Minimum 2 tracking cities required
          </div>

        ) : (
          <>
            <button
              onClick={() =>
                setShowMobileTracking(
                  !showMobileTracking
                )
              }
              className="absolute top-3 left-3 md:top-4 md:left-4 z-20 w-8 h-8 cursor-pointer rounded-full
                bg-white
                shadow-xl
                border border-gray-200

                flex items-center justify-center

                hover:bg-gray-50
                transition
              "
            >
              {showMobileTracking ? (
                <IoClose
                  size={18}
                  className="text-gray-700"
                />
              ) : (
                <div className="space-y-[3px]">
                  <div className="w-4 h-[2px] bg-gray-700 rounded-full" />
                  <div className="w-4 h-[2px] bg-gray-700 rounded-full" />
                  <div className="w-4 h-[2px] bg-gray-700 rounded-full" />
                </div>
              )}
            </button>

            <CommonGoogleMap
              isLoaded={isLoaded}
              directions={directions}
              markers={markers}
              showTrackingPanel={false}
              height="100%"
            >
                  <div className="absolute z-10 top-3 left-3 md:top-7 md:left-4">
                  <div  className={`rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-2xl
                      p-3 transition-all duration-300 w-[220px] md:w-[240px]  ${ showMobileTracking
                            ? "opacity-100 visible translate-x-0"
                            : "opacity-0 invisible -translate-x-5"
                        } `} >
                    <div className="flex items-center justify-between gap-2">
                    <div className="text-[13px] text-gray-500 font-medium">
                      Live Shipment Tracking
                    </div>
                  </div>
                      <div className=" mt-3 space-y-3 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                  {markers.map((item, index) => {
                          return (
                          <div  key={index} className="flex gap-3 relative">
                    {index !== markers.length - 1 && (
                      <div className="absolute left-[7px] top-5 w-[2px] h-[38px] bg-gray-200"/>
                    )}

                    <div
                      className={`mt-1 w-[14px] h-[14px] rounded-full shrink-0 border-2 border-white shadow
                    
                      `}
                    />

                    <div className="pb-2 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[13px] font-semibold text-gray-800">
                          {item.city}
                        </div>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-[2px]">
                        {item.date}
                      </div>
                    </div>
                  </div>
                          );
                        })}

                      </div>
                    </div>
                  </div>
            </CommonGoogleMap>
          </>
              )}
            </div>
          )} */}
          </div>

          {/* ================= FOOTER ================= */}
          <div className="border-t border-gray-100 px-4 sm:px-5 py-3 flex items-center justify-end gap-2 shrink-0">
            <button
              onClick={() => setShowTrackingModal(false)}
              className="
                h-10 px-4 rounded-xl border border-gray-300
                text-[13px] font-medium text-gray-700
                hover:bg-gray-100 transition
              "
            >
              Cancel
            </button>
            {activeTab === "form" && (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className={`
                  h-10 px-5 rounded-xl text-[13px] font-semibold text-white transition
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
