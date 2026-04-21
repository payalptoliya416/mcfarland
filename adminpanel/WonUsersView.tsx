"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";
import { adminUpdateContractStatusService, adminWonDetailsService, WonDetailsData } from "@/api/admin/biddingWonUsers";
import { formatPrice } from "@/hooks/formate";
import ApproveContractModal from "./ApproveContractModal";

/* ================= STATUS COLORS ================= */

const statusStyleMap: Record<string, string> = {
  Pending: "bg-[#FFCA42] text-black",
  Send: "bg-[#A855F7] text-white",
  Signed: "bg-[#3B82F6] text-white",
  Approved: "bg-[#22C55E] text-white",
  Rejected: "bg-[#EF4444] text-white",
  Unknown: "bg-gray-400 text-white",
};

export default function WonUsersView() {
  const searchParams = useSearchParams();
  const machineryId = Number(searchParams.get("id"));
const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [data, setData] = useState<WonDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<
        "approve" | "reject" | null
    >(null);
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth <= 768);
  check();
  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);
  /* ================= FETCH ================= */

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await adminWonDetailsService({
        machinery_id: machineryId,
      });

      if (res.success) {
        setData(res.data);
      }
    } catch (e) {
      toast.error("Failed to load contract details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (machineryId) fetchDetails();
  }, [machineryId]);

    const handleAction = async (action: "approve" | "reject") => {
    if (!data) return;

    try {
      setActionLoading(action);

      const res = await adminUpdateContractStatusService({
        machinery_id: data.machinery_id,
        action,
      });

      if (res.success) {
        toast.success(res.message || "Status updated successfully");
        await fetchDetails(); 
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (values: {
  bank_name: string;
  beneficiary_name: string;
  beneficiary_address: string;
  account_number: string;
  routing_number: string;
  branch_address: string;
}) => {
  if (!data) return;

  try {
    setActionLoading("approve");

    const res = await adminUpdateContractStatusService({
      machinery_id: data.machinery_id,
      action: "approve",
      bank_name: values.bank_name,
      beneficiary_name: values.beneficiary_name,
      beneficiary_address: values.beneficiary_address,
      account_number: values.account_number,
      routing_number: values.routing_number,
      branch_address: values.branch_address, 
    });

    if (res.success) {
      toast.success(res.message || "Approved successfully");
      setApproveModalOpen(false);
      await fetchDetails();
    }
  } catch {
    toast.error("Failed to approve");
  } finally {
    setActionLoading(null);
  }
};

 const isFinalStatus = ["Approved", "Rejected"].includes(
    data?.contract_status || ""
  );
const isActionAllowed = data?.contract_status === "Signed";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-5">
      {/* ================= TOP CARD ================= */}
      <div className="bg-white border border-border rounded-[10px] p-[25px]">
        {/* HEADER */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <h2 className="text-[#000000] text-2xl font-semibold">
            {data.machinery_name}
          </h2>

          <span
            className={`px-[22px] py-2 text-xs rounded-[10px] ${
              statusStyleMap[data.contract_status]
            }`}
          >
            {data.contract_status}
          </span>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-base text-[#8A8A8A] mb-1">User Name:</p>
            <p className="text-secgray font-medium">
              {data.user_full_name}
            </p>
          </div>

          <div>
            <p className="text-base text-[#8A8A8A] mb-1">Phone Number:</p>
            <p className="text-secgray font-medium">
              {data.phone_no}
            </p>
          </div>

          <div>
            <p className="text-base text-[#8A8A8A] mb-1">Category:</p>
            <p className="text-secgray font-medium">
              {data.category}
            </p>
          </div>

          <div>
            <p className="text-base text-[#8A8A8A] mb-1">Won Bid Amount:</p>
            <p className="text-secgray font-medium">
             {formatPrice(data.won_bid_amount)}
            </p>
          </div>
        </div>
      </div>

      {/* ================= CONTRACT VIEW ================= */}
      <div className="bg-white border border-border rounded-[10px] p-[25px]">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h3 className="text-lg font-semibold">Contract</h3>

          <div className="flex gap-3">
           <button
            disabled={!isActionAllowed || actionLoading !== null}
            onClick={() => handleAction("reject")}
            className="px-6 py-2 rounded-md bg-[#EF4444] text-white text-sm flex items-center gap-2 disabled:cursor-not-allowed cursor-pointer"
            >
            {actionLoading === "reject" && <Spinner />}
            Declined
            </button>

            <button
            disabled={!isActionAllowed || actionLoading !== null}
           onClick={() => setApproveModalOpen(true)}
            className="px-6 py-2 rounded-md bg-[#22C55E] text-white text-sm flex items-center gap-2  cursor-pointer disabled:cursor-not-allowed"
            >
            {actionLoading === "approve" && <Spinner />}
            Approve
            </button>
          </div>
        </div>

        {data.contract_file_url ? (
        <div className="w-full overflow-hidden">
          <iframe
            src={
              isMobile
                ? `${data.contract_file_url}#view=FitH&toolbar=0&navpanes=0`
                : data.contract_file_url
            }
            className="w-full rounded-md border"
            style={{
              height: isMobile ? "90vh" : "600px",
              border: "1px solid #e5e7eb",
            }}
          />
        </div>
      ) : (
        <p className="text-sm text-gray-500">No contract uploaded</p>
      )}

      </div>
      <ApproveContractModal
  open={approveModalOpen}
  onClose={() => setApproveModalOpen(false)}
  onSubmit={handleApprove}
  loading={actionLoading === "approve"}
/>
    </div>
  );
}

function Spinner() {
  return (
    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );
}