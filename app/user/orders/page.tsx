"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  DeliveryStatus,
  DeliveryTimelineItem,
  OrderApiItem,
  orderService,
} from "@/api/user/bids";
import Loader from "@/components/common/Loader";
import { formatPrice } from "@/hooks/formate";
import { IoCallOutline } from "react-icons/io5";
import Accordion from "@/api/user/Accordion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { FiUploadCloud } from "react-icons/fi";
import { FaRegImage } from "react-icons/fa";
import { useSettings } from "@/contexts/SettingsContext";
/* ================= TYPES ================= */

type OrderData = {
  id?: number;
  order_id: string;
  name: string;
  first_image: string;
  working_hours: string;
  weight: string;
  year: string;
  price: string;
  serial_no: string;
  delivery_contact: string | null;
  delivery_status_text: DeliveryStatus;
  delivery_timeline: DeliveryTimelineItem[];
  type_text: "Checkout" | "Bidding";
  invoice_url?: string;
  payment_slip_url?: string | null;
  contract_url?: string;
};
type StepItem = {
  key: DeliveryStatus;
  title: string;
};
type UIStepStatus = DeliveryStatus | "Payment Confirmed";
/* ================= HELPERS ================= */
const statusToStep: Record<string, number> = {
  "Order Submitted": 0,
  "Sales Agreement": 1,
  "Awaiting Invoice": 2,
  "Settle Payment": 3,
  "Payment Confirmed": 4,
  Processing: 5,
  "Shipping Started": 6,
  "In Transit": 7,
  Delivered: 8,
  Cancelled: 9,
};

const STEPS: StepItem[] = [
  { key: "Order Submitted", title: "Order Submitted" },
  { key: "Sales Agreement", title: "Sales Agreement" },
  { key: "Awaiting Invoice", title: "Awaiting Invoice" },
  { key: "Settle Payment", title: "Settle Payment" },
  { key: "Payment Confirmed", title: "Payment Confirmed" },
  { key: "Processing", title: "Processing" },
  { key: "Shipping Started", title: "Shipping Started" },
  { key: "In Transit", title: "In Transit" },
  { key: "Delivered", title: "Delivered" },
];

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

/* ================= PAGE ================= */

export default function MyBuyOrders() {
  const { phoneNumber } = useSettings();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(
    null,
  );
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const mapOrderApiToUI = (item: OrderApiItem): OrderData => ({
    id: item.id,
    order_id: item.order_id,
    name: item.name,
    first_image: item.first_image ?? "",
    working_hours: item.working_hours,
    weight: item.weight,
    year: item.year,
    price: item.price,
    serial_no: item.serial_no,
    delivery_contact: item.delivery_contact,
    delivery_status_text: item.delivery_status_text as DeliveryStatus,
    delivery_timeline: item.delivery_timeline,
    invoice_url: item.invoice_url,
    type_text: item.type_text as "Checkout" | "Bidding",
    payment_slip_url: item.payment_slip_url ?? null,
    contract_url: item.contract_url,
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(""); // 👈 important
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await orderService.getOrders({
        page,
        per_page: perPage,
        search,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      if (res.success) {
        if (!res.data || res.data.length === 0) {
          setOrders([]);
          setTotalPages(1);
          setNoDataMessage("No orders found");
          return;
        }

        setOrders(res.data.map(mapOrderApiToUI));
        setTotalPages(res.pagination.last_page);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, perPage, search, sortBy, sortOrder]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  };

  const uploadPaymentSlip = async () => {
    if (!paymentFile || !selectedOrderId) {
      setErrorMsg("Please upload payment Receipt");
      return;
    }

    try {
      setUploading(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const base64 = await fileToBase64(paymentFile);

      const res = await orderService.uploadPaymentSlip({
        order_id: selectedOrderId,
        payment_slip: base64,
      });

      if (res.success) {
        setSuccessMsg(res.message || "Payment Receipt uploaded successfully");
        setPaymentFile(null);
        setOpenConfirmationModal(false);
        fetchOrders();
        setTimeout(() => {
          setSuccessMsg(null);
        }, 2000);
      } else {
        setErrorMsg(res.message || "Upload failed");
      }
    } catch (err) {
      setErrorMsg("Something went wrong while uploading");
    } finally {
      setUploading(false);
    }
  };

  const isPdf = (url?: string | null) =>
    !!url && url.toLowerCase().endsWith(".pdf");

  const isImage = (url?: string | null) =>
    !!url &&
    (url.toLowerCase().endsWith(".jpg") ||
      url.toLowerCase().endsWith(".jpeg") ||
      url.toLowerCase().endsWith(".png") ||
      url.toLowerCase().endsWith(".webp"));

  const getCurrentStepFromTimeline = (
    timeline: DeliveryTimelineItem[],
    steps: StepItem[],
  ) => {
    if (!timeline || timeline.length === 0) return 0;

    const completedStatuses: DeliveryStatus[] = timeline.map((t) => t.status);

    const lastCompletedIndex = steps.reduce((acc, step, index) => {
      if (completedStatuses.includes(step.key)) {
        return index;
      }
      return acc;
    }, 0);

    return lastCompletedIndex;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }
  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const selectedStep = selectedOrder
    ? getCurrentStepFromTimeline(selectedOrder.delivery_timeline, STEPS)
    : 0;

  const selectedConfirmationIndex = STEPS.findIndex(
    (s) => s.key === "Settle Payment",
  );

  const isAfterSettle = selectedStep > selectedConfirmationIndex;

  return (
    <section className="py-11 sm:py-[60px]">
      <div className="container-custom mx-auto">
        <h1 className="text-secgray text-[26px] font-bold mb-6">
          My Buy It Now Orders
        </h1>
        {!loading && orders.length === 0 && (
          <div className="flex items-center justify-center min-h-[30vh]">
            <h2 className="text-lg sm:text-xl font-medium text-gray-600">
              No Orders Found
            </h2>
          </div>
        )}
        <div className="space-y-6">
          {orders.map((data) => {
            // const filteredSteps =
            //   data.type_text === "Bidding"
            //     ? STEPS
            //     : STEPS.filter((s) => s.key !== "Awaiting Invoice");
            const filteredSteps = STEPS;
            const step = getCurrentStepFromTimeline(
              data.delivery_timeline,
              filteredSteps,
            );

            const isConfirmed = !!data.payment_slip_url;
            const confirmationDate = isConfirmed
              ? new Date().toISOString()
              : null;

            const confirmationIndex = filteredSteps.findIndex(
              (s) => s.key === "Settle Payment",
            );

            const SalesAgreementIndex = filteredSteps.findIndex(
              (s) => s.key === "Sales Agreement",
            );

            return (
              <div
                key={data.order_id}
                className="border border-border rounded-[14px] overflow-hidden mb-6"
              >
                <div className="p-[15px]">
                  <div className="grid grid-cols-12 items-center gap-5">
                    <div className="col-span-12 lg:col-span-7 lg:flex gap-5 items-center">
                      <div className=" rounded flex justify-center items-center mb-5 lg:mb-0">
                        <Image
                          src={data.first_image}
                          alt={data.name}
                          width={110}
                          height={80}
                        />
                      </div>

                      <div>
                        <h2 className="mb-4 text-xl text-secgray">
                          {data.name}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-seclightgray">
                          <p>Hours: {data.working_hours}</p>
                          <p>Total Weight: {data.weight}</p>
                          <p>Year: {data.year}</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 lg:col-span-5 lg:text-right">
                      <h2 className="text-green text-[22px] mb-4 font-semibold">
                        {formatPrice(data.price)}
                      </h2>
                      <p className="text-text-gray mb-2">Serial Number</p>
                      <span className="py-1 px-2 text-sm rounded bg-border">
                        {data.serial_no}
                      </span>
                    </div>
                  </div>
                </div>
                {/* ================= BODY ================= */}
                <div className="border-t px-6 py-6 bg-white border-border">
                  <div className="flex justify-between mb-16 flex-wrap gap-5">
                    <div>
                      <h3 className="text-xl font-medium">Order ID</h3>
                      <p className="text-seclightgray">#{data.order_id}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-xl font-medium">
                          Delivery Contact
                        </h3>
                        {phoneNumber ? (
                          <a
                            href={`tel:${phoneNumber}`}
                            className="text-seclightgray hover:text-green transition"
                          >
                            {phoneNumber}
                          </a>
                        ) : (
                          <p className="text-gray-400">Not Available</p>
                        )}
                      </div>
                      <div className="w-[38px] h-[38px] flex justify-center items-center rounded-full bg-border">
                        <IoCallOutline />
                      </div>
                    </div>
                  </div>
                </div>
                {/* ================= TIMELINE ================= */}

                <div
                  className="relative z-20 flex flex-col lg:grid p-3"
                  style={{
                    gridTemplateColumns:
                      typeof window !== "undefined"
                        ? `repeat(${filteredSteps.length}, minmax(0, 1fr))`
                        : undefined,
                  }}
                >
                  {/* BACK LINE */}
                  <div
                    className="hidden lg:block absolute top-[26px] h-[6px] bg-[#E8E8E8] rounded -z-10"
                    style={{
                      left: `calc(50% / ${filteredSteps.length})`,
                      right: `calc(50% / ${filteredSteps.length})`,
                    }}
                  />
                  {/* ACTIVE LINE */}
                  <div
                    className="hidden lg:block absolute top-[26px] h-[6px] bg-[#FFAD01] rounded -z-10 transition-all"
                    style={{
                      left: `calc(50% / ${filteredSteps.length})`,
                      width: `calc(${Math.min(step, filteredSteps.length - 1)} * (100% / ${filteredSteps.length}))`,
                    }}
                  />

                  {filteredSteps.map((s, idx) => {
                    const completed =
                      s.key === "Settle Payment" ? isConfirmed : step >= idx;

                    const item =
                      s.key === "Settle Payment"
                        ? null
                        : data.delivery_timeline?.find(
                            (t) => t.status === s.key,
                          );
                    return (
                      <div className="relative">
                        <div className="hidden lg:block">
                          {s.key === "Sales Agreement" &&
                            data.contract_url &&
                            step >= SalesAgreementIndex && (
                              <div
                                className="
                          mb-2
                          lg:absolute lg:-top-20 lg:left-1/2 lg:-translate-x-1/2
                          text-center
                        "
                              >
                                <a
                                  href={data.contract_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-col items-center gap-1 text-xs text-secgray"
                                >
                                  <span>View Agreement</span>
                                  <FaFilePdf className="text-[#FFCA42] text-lg" />
                                </a>
                              </div>
                            )}
                          {s.key === "Settle Payment" &&
                            data.invoice_url &&
                            step >= confirmationIndex && (
                              <div
                                className="
                          mb-2
                          lg:absolute lg:-top-20 lg:left-1/2 lg:-translate-x-1/2
                          text-center
                        "
                              >
                                <a
                                  href={data.invoice_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-col items-center gap-1 text-xs text-secgray"
                                >
                                  <span>View Invoice</span>
                                  <FaFilePdf className="text-green text-lg" />
                                </a>
                              </div>
                            )}
                        </div>
                        <div
                          key={s.key}
                          onClick={() => {
                              if (s.key === "Settle Payment" && step <= confirmationIndex) {
                              setSelectedOrderId(data.id!);
                              setSelectedOrderNumber(data.order_id);
                              setOpenConfirmationModal(true);
                              setPaymentFile(null);
                            }
                          }}
                          className={`flex items-start gap-4
                          lg:flex-col lg:items-center
                          ${s.key === "Settle Payment" ? "cursor-pointer group" : ""}`}
                        >
                          <div className="relative flex flex-col items-center">
                            <div
                              className={`w-[36px] h-[36px] rounded-full flex items-center justify-center transition
                                ${
                                  s.key === "Settle Payment"
                                    ? "bg-[#E6F4F1] group-hover:scale-110 group-hover:ring-1 group-hover:ring-green"
                                    : completed
                                      ? "bg-lightgreen"
                                      : "bg-border"
                                }`}
                            >
                              <div
                                className={`w-[22px] h-[22px] rounded-full ${
                                  completed ? "bg-[#FFAD01]" : "bg-light-gray"
                                }`}
                              />
                            </div>

                            {/* 🔥 Vertical Line (Mobile Only) */}
                            {idx !== filteredSteps.length - 1 && (
                              <div
                                className={`lg:hidden w-[3px] h-13 lg:h-8 ${
                                  completed ? "bg-[#FFAD01]" : "bg-[#E8E8E8]"
                                }`}
                              />
                            )}
                          </div>

                          <div className="lg:text-center">
                            <h3
                              className={`text-lg font-medium ${
                                s.key === "Settle Payment"
                                  ? "text-green"
                                  : "text-secgray"
                              }`}
                            >
                              {s.title}
                            </h3>

                            {s.key === "Settle Payment" && (
                              <>
                                {!isConfirmed ? (
                                  <p className="text-xs text-green mt-1">
                                    {isAfterSettle
                                      ? "Payment step completed"
                                      : "Click to upload payment Receipt"}
                                  </p>
                                ) : (
                                  <p className="text-sm text-seclightgray">
                                    {formatDateTime(confirmationDate!)}
                                  </p>
                                )}
                              </>
                            )}

                            {item?.date && (
                              <p className="text-sm text-seclightgray">
                                {formatDateTime(item.date)}
                              </p>
                            )}

                            <div className="block lg:hidden">
                              {s.key === "Sales Agreement" &&
                                data.contract_url &&
                                step >= SalesAgreementIndex && (
                                  <div
                                    className="
                          mb-2
                          lg:absolute lg:-top-20 lg:left-1/2 lg:-translate-x-1/2
                          text-center
                        "
                                  >
                                    <a
                                      href={data.contract_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 text-xs text-secgray mt-1"
                                    >
                                      <span>View Agreement</span>
                                      <FaFilePdf className="text-[#FFCA42] text-lg" />
                                    </a>
                                  </div>
                                )}
                              {s.key === "Settle Payment" &&
                                data.invoice_url &&
                                step >= confirmationIndex && (
                                  <div
                                    className="
                          mb-2
                          lg:absolute lg:-top-20 lg:left-1/2 lg:-translate-x-1/2
                          text-center
                        "
                                  >
                                    <a
                                      href={data.invoice_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 text-xs text-secgray mt-1"
                                    >
                                      <span>View Invoice</span>
                                      <FaFilePdf className="text-green text-lg" />
                                    </a>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1 sm:gap-2 justify-center mt-10 flex-wrap">
            {/* PREV */}
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`flex items-center gap-2 w-8 sm:w-auto sm:px-3 justify-center py-2
                border border-border rounded-md sm:rounded-xl text-text-gray transition-all
                h-8 sm:h-11 text-xs sm:text-base cursor-pointer
                ${page === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              <FaChevronLeft className="text-xs sm:text-sm" />
              <span className="hidden md:block">Back</span>
            </button>

            {/* PAGE NUMBERS */}
            {(() => {
              let pages: (number | string)[] = [];

              if (totalPages <= 6) {
                pages = Array.from({ length: totalPages }, (_, i) => i + 1);
              } else {
                pages.push(1);

                if (page > 3) pages.push("...");

                const start = Math.max(2, page - 1);
                const end = Math.min(totalPages - 1, page + 1);

                for (let i = start; i <= end; i++) {
                  pages.push(i);
                }

                if (page < totalPages - 2) pages.push("...");

                pages.push(totalPages);
              }

              return pages.map((p, index) =>
                p === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="px-1 sm:px-2 text-gray-400 font-semibold text-xs sm:text-base"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center
                      rounded-md sm:rounded-xl transition-all text-xs sm:text-base  cursor-pointer
                      ${
                        page === p
                          ? "bg-green text-white"
                          : "border border-border text-text-gray hover:bg-gray-100"
                      }`}
                  >
                    {p}
                  </button>
                ),
              );
            })()}

            {/* NEXT */}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`flex items-center gap-2 w-8 sm:w-auto sm:px-3 justify-center py-2
                border border-border rounded-md sm:rounded-xl text-text-gray transition-all
                h-8 sm:h-11 text-xs sm:text-base  cursor-pointer
                ${page === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              <span className="hidden md:block">Next</span>
              <FaChevronRight className="text-xs sm:text-sm" />
            </button>
          </div>
        )}
      </div>
      {openConfirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            className="
        bg-white rounded-2xl shadow-xl w-full max-w-md
        max-h-[90vh] overflow-y-auto
        p-5 sm:p-6
      "
          >
            {/* TITLE */}
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
              Order Confirmation
            </h2>

            <p className="text-gray-600 text-sm mb-5">
              Please upload the payment Receipt for order
              <span className="font-semibold"> #{selectedOrderNumber}</span>.
            </p>

            {/* UPLOAD BOX */}
            {!orders.find((o) => o.id === selectedOrderId)?.payment_slip_url ? (
              /* ================= UPLOAD BOX ================= */
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-green transition">
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg"
                  hidden
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setPaymentFile(e.target.files[0]);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }
                  }}
                />

                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center text-green">
                    <FiUploadCloud size={22} />
                  </div>

                  <p className="text-sm font-medium text-gray-700">
                    Click to upload payment Receipt
                  </p>

                  <p className="text-xs text-gray-500">
                    PDF, JPG or PNG (max 10MB)
                  </p>
                </div>
              </label>
            ) : (
              /* ================= ALREADY UPLOADED ================= */
              <div className="border rounded-xl p-4 bg-green/5">
                <p className="text-sm text-green font-medium mb-2">
                  Payment Receipt already uploaded
                </p>

                <a
                  href={
                    orders.find((o) => o.id === selectedOrderId)
                      ?.payment_slip_url!
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition"
                >
                  {isImage(
                    orders.find((o) => o.id === selectedOrderId)
                      ?.payment_slip_url,
                  ) ? (
                    <FaRegImage className="text-blue-600 text-xl" />
                  ) : (
                    <FaFilePdf className="text-red-600 text-xl" />
                  )}

                  <span className="text-sm text-gray-700">
                    View Payment Receipt
                  </span>
                </a>
              </div>
            )}

            {/* FILE PREVIEW */}
            {paymentFile && (
              <div className="mt-4 flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                {paymentFile.type.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(paymentFile)}
                    alt="Payment Receipt Preview"
                    className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-md bg-red-100 text-red-600 text-xl">
                    📄
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {paymentFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(paymentFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <button
                  onClick={() => setPaymentFile(null)}
                  className="text-gray-400 hover:text-red-500 text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* SUCCESS / ERROR */}
            {successMsg && (
              <p className="text-green-600 text-sm mt-4 font-medium">
                {successMsg}
              </p>
            )}

            {errorMsg && (
              <p className="text-red-500 text-sm mt-4">{errorMsg}</p>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenConfirmationModal(false)}
                disabled={uploading}
                className="px-4 py-1 rounded-lg border text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={uploadPaymentSlip}
                disabled={
                  uploading ||
                  !!orders.find((o) => o.id === selectedOrderId)
                    ?.payment_slip_url
                }
                className="px-5 py-1 rounded-lg bg-green text-white font-medium disabled:opacity-50 cursor-pointer"
              >
                {uploading ? "Uploading..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
