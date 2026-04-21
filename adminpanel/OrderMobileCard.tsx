"use client";

import { FaFilePdf } from "react-icons/fa6";
import OrderStatusDropdown from "./OrderStatusDropdown";
import { IoReceiptSharp } from "react-icons/io5";

type Props = {
  order: any;
  onUpdated: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenPaymentSlip: (order: any) => void;
};
function PaymentSlipBadge({
  status,
}: {
  status: "Pending" | "Approve" | "Decline";
}) {
  const config = {
    Pending: {
      dot: "bg-yellow-400",
      text: "text-yellow-700",
      bg: "bg-yellow-50",
      label: "Pending",
    },
    Approve: {
      dot: "bg-green-500",
      text: "text-green-700",
      bg: "bg-green-50",
      label: "Approved",
    },
    Decline: {
      dot: "bg-red-500",
      text: "text-red-700",
      bg: "bg-red-50",
      label: "Declined",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.bg} ${config.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export default function OrderMobileCard({
  order,
  onUpdated,
  onView,
  onEdit,
  onDelete,
  onOpenPaymentSlip,
}: Props) {
  const isPaymentSlipDisabled =
    order.paymentSlipStatus === "Pending" && !order.paymentSlipUrl;
    const isContractDisabled = !order.contractUrl || order.contractUrl.trim() === "";
  return (
    <div className="border border-border rounded-xl p-4 bg-white space-y-4">
      {/* Order ID */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500">Order ID</p>
          <p className="font-semibold">{order.orderId}</p>
        </div>
      </div>
      <div className="text-sm">
        <span className="text-gray-500">Machinery:</span>{" "}
        <span className="font-medium">{order.machineryName}</span>
      </div>

      <div className="border-t border-border" />

      {/* Fields */}
      <Field label="User Name" value={order.userName} />
      <Field label="Phone Number" value={order.phone} />
      <Field label="Order Date" value={order.orderDate} />
      <Field label="Order Amount" value={order.orderAmount} />
      {/* Payment Receipt Status */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Payment Receipt</span>

        <PaymentSlipBadge status={order.paymentSlipStatus} />
      </div>

      {/* Status */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Status</span>
        <OrderStatusDropdown
          value={order.status}
          orderId={order.id}
          orderType={order.typeText as "Checkout" | "Bidding"}
            paymentSlipStatus={order.paymentSlipStatus}
          paymentSlipUrl={order.paymentSlipUrl}
          onUpdated={onUpdated}
        />
      </div>
      <div className="flex justify-between items-start flex-col gap-2">
         <button
          onClick={() =>
            order.invoiceUrl && window.open(order.invoiceUrl, "_blank")
          }
          disabled={!order.invoiceUrl}
          className={`mt-2 flex items-center gap-2 text-sm font-medium
    ${
      order.invoiceUrl
        ? "text-green cursor-pointer"
        : "text-green  cursor-not-allowed"
    }
  `}
        >
          <FaFilePdf size={20} />
          Invoice
        </button>
       
        <button
          onClick={() =>
            !isContractDisabled &&
            window.open(order.contractUrl, "_blank", "noopener,noreferrer")
          }
          disabled={isContractDisabled}
          className={`mt-2 flex items-center gap-2 text-sm font-medium transition
            ${
              isContractDisabled
                ? "text-[#EDB423] cursor-not-allowed"
                : "text-[#EDB423] cursor-pointer hover:opacity-80"
            }
          `}
        >
          <FaFilePdf size={20} />
          Contract
        </button>

         <button
          disabled={isPaymentSlipDisabled}
          onClick={() => !isPaymentSlipDisabled && onOpenPaymentSlip(order)}
          className={`flex items-center gap-2 text-sm font-medium transition mt-2
    ${
      isPaymentSlipDisabled
        ? "text-orange  cursor-not-allowed"
        : "text-orange cursor-pointer hover:opacity-80"
    }
  `}
        >
          <IoReceiptSharp size={18} />
          Payment Receipt
        </button>
      </div>
      {/* Actions */}
      {/* <div className="flex justify-end gap-4 pt-4 border-t border-border">
        <button onClick={onEdit}><BiEdit /></button>
        <button onClick={onView}><BiEdit /></button>
        <button onClick={onDelete} className="text-red-500">
          <HiOutlineTrash />
        </button>
      </div> */}
    </div>
  );
}

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}
