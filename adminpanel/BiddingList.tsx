"use client";

import React, { useEffect, useState } from "react";
import MyBiddingListTable, { MyBidRow } from "./MyBiddingListTable";
import { useSearchParams } from "next/navigation";
import {
  adminBiddingService,
  getMachineryBiddingDetails,
  MachineryInfo,
} from "@/api/admin/bidding";
import Loader from "@/components/common/Loader";
import { useIsMobile } from "@/hooks/useIsMobile";
import ConfirmModal from "@/components/tables/ConfirmDialog";
import toast from "react-hot-toast";
import { HiOutlineTrash } from "react-icons/hi2";

function BiddingList() {
  const searchParams = useSearchParams();
  const machineryId = Number(searchParams.get("id"));

  const [rows, setRows] = useState<MyBidRow[]>([]);
  const [details, setDetails] = useState<MachineryInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const formatBidDateTime = (date: string) => {
    return new Date(date)
      .toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "") // remove extra comma
      .replace(" ", ", ") // add comma after month
      .replace(" ", " | ");
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    await handleDelete(deleteId);
    setDeleteId(null);
  };

  const isMobile = useIsMobile();
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getMachineryBiddingDetails(machineryId);
      if (res.success) {
        setDetails(res.data.machinery_info);
        const mapped = res.data.bidding_details.map((item, idx) => ({
          id: String(item.id),
          user_name: item.user_full_name,
          email: item.user_email,
          phone: item.user_phone,
          last_bid: Number(item.bid_amount),
          bidding_date: new Date(item.bid_created_at).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          isHighlighted: item.is_highest,
          isWon: item.is_won,
          status: item.status,
        }));

        setRows(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!machineryId) return;
    fetchData();
  }, [machineryId]);

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(true);

      const res: any = await adminBiddingService.deleteBid(id);

      if (res?.success) {
        toast.success(res.message || "Bid deleted successfully");
        setRows((prev) => prev.filter((item) => item.id !== id));
        await fetchData();
      } else {
        toast.error(res?.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  };
  const hideAction = details?.status === 2;
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[12px] border border-border p-5">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-[20px]">
        {/* LEFT SIDE */}
        <div className="flex-1">
          <p className="text-[13px] sm:text-[14px] text-[#8C8C8C] mb-[4px]">
            Machinery Name:
          </p>

          <h2 className="text-[16px] sm:text-[18px] font-semibold text-secgray mb-[14px]">
            {details?.name || ""}
          </h2>

          <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[40px]">
            {/* BID TIME */}
            <div>
              <p className="text-[13px] sm:text-[14px] text-[#8C8C8C] mb-[6px]">
                Bid End Time
              </p>
              <span className="inline-block bg-[#F5F5F5] text-secgray text-[13px] sm:text-[14px] px-[12px] py-[6px] rounded-[6px]">
                {details?.bid_end_time
                  ? formatBidDateTime(details.bid_end_time)
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col sm:flex-row gap-[20px] sm:gap-[40px] lg:items-start justify-between">
          {/* BID START PRICE */}
          <div className="">
            <p className="text-[13px] sm:text-[14px] text-[#8C8C8C] mb-[6px]">
              Bid Start Price:
            </p>
            <p className="text-[16px] sm:text-[18px] font-semibold text-secgray">
              ${Number(details?.bid_start_price || 0).toLocaleString()}
            </p>
          </div>

          {/* HIGHEST BID */}
          <div className="">
            <p className="text-[13px] sm:text-[14px] text-[#8C8C8C] mb-[6px]">
              Highest bid
            </p>
            <p className="text-[16px] sm:text-[18px] font-semibold text-secgray mb-[10px]">
              ${Number(details?.highest_bid || 0).toLocaleString()}
            </p>

            <button className="w-full sm:w-auto bg-[#3C97FF] text-white text-[13px] sm:text-[14px] font-medium px-[20px] py-[6px] rounded-[8px]">
              {details?.bid_status
                ? details.bid_status.charAt(0).toUpperCase() +
                  details.bid_status.slice(1)
                : ""}
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      {isMobile ? (
        <div className="space-y-4 mt-4">
          {loading && (
            <div className="flex justify-center py-10">
              <Loader />
            </div>
          )}

          {!loading && rows.length === 0 && (
            <div className="text-center py-10 text-gray-500">No bids found</div>
          )}

          {!loading &&
            rows.map((row) => (
              <div
                key={row.id}
                className={`border border-border rounded-xl p-4 bg-white space-y-2
            ${
              row.isWon
                ? "bg-[#E6F9EF]"
                : row.isHighlighted
                  ? "bg-[#FFF7E3]"
                  : ""
            }
          `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-secgray">
                      {row.user_name}
                    </p>
                    <p className="text-xs text-gray-500">{row.email}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {row.isWon && (
                      <span className="text-xs bg-[#35BB63] text-white px-2 py-1 rounded">
                        Won
                      </span>
                    )}

                    {!hideAction && (
                      <HiOutlineTrash
                        className="text-[#DD3623] cursor-pointer"
                        size={16}
                        onClick={() => setDeleteId(row.id)}
                      />
                    )}
                  </div>
                </div>

                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span>{row.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bid Time</span>
                    <span>{row.bidding_date}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-500">Bid Amount</span>
                    <span>${row.last_bid.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <MyBiddingListTable
          data={rows}
          loading={loading}
          hideAction={details?.status === 2}
          onRefresh={fetchData} 
        />
      )}
      <ConfirmModal
        open={deleteId !== null}
        title="Delete Bid"
        description="Are you sure you want to delete this bid?"
        confirmText="Yes, Delete"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}

export default BiddingList;
