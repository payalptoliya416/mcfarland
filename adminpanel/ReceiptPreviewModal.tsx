"use client";
import { FaTimes } from "react-icons/fa";

type Props = {
  open: boolean;
  url: string | null;
  orderId: number | null;
  onClose: () => void;
  onApprove: (orderId: number) => void;
  onDecline: (orderId: number) => void;
};

export default function ReceiptPreviewModal({
  open,
  url,
  orderId,
  onClose,
  onApprove,
  onDecline,
}: Props) {
  if (!open || !url || !orderId) return null;

  const isPdf = url.endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl w-full max-w-3xl relative overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="font-semibold">Payment Receipt</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 h-[70vh] overflow-auto">
          {isPdf ? (
            <iframe
              src={url}
              className="w-full h-full rounded-md"
            />
          ) : (
            <img
              src={url}
              alt="Payment Receipt"
              className="max-w-full mx-auto rounded-md"
            />
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 px-4 py-3 border-t">
          <button
            onClick={() => onDecline(orderId)}
            className="px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-50"
          >
            Decline
          </button>
          <button
            onClick={() => onApprove(orderId)}
            className="px-4 py-2 rounded-lg bg-green text-white hover:opacity-90"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
