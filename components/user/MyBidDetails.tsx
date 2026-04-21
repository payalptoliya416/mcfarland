"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MyBidDataTable from "./MyBidDataTable";
import { bidDetailsService, MachineryDetails } from "@/api/user/bids";
import { formatDateTime } from "@/api/admin/bidding";
import Loader from "../common/Loader";
import { useIsMobile } from "@/hooks/useIsMobile";

export interface BidRow {
  id: string;
  user_name: string;
  last_bid: number;
  bidding_date: string;
  isHighlighted?: boolean;
}
const highlightClass = "bg-[#FFF7E3]";

function MyBidDetails() {
  const searchParams = useSearchParams();
  const machineryId = Number(searchParams.get("id"));
  const router = useRouter();
  const [details, setDetails] = useState<MachineryDetails | null>(null);
  const [rows, setRows] = useState<BidRow[]>([]);
  const [loading, setLoading] = useState(false);
const isMobile = useIsMobile();
  const formatPrice = (value?: string | null) =>
    value ? `$${Number(value).toLocaleString()}` : "-";

  useEffect(() => {
    if (!machineryId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await bidDetailsService.getMachineryBidDetails(machineryId);

        if (res.success) {
          setDetails(res.machinery_details);

          const mappedRows: BidRow[] = res.bidding_details.map((bid, idx) => ({
            id: String(idx),
            user_name: bid.user_full_name,
            last_bid: Number(bid.amount),
            bidding_date: formatDateTime(bid.bid_date_time),
            isHighlighted: bid.my_bid,
          }));

          setRows(mappedRows);
        }
      } catch (err) {
        console.error("Failed to fetch bid details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [machineryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
       <Loader />
     </div>
   );
  }
  if (!details) return null;
  return (
    <section className="py-[25px]">
      <div className="container-custom mx-auto">
        {/* TITLE */}
        <h1 className="text-gray text-[26px] font-bold mb-[10px]">
          {details.machinery_name}
        </h1>

        {/* BREADCRUMB */}
        <p className="text-sm text-seclightgray mb-[15px]">
          <span
            onClick={() => router.push("/user/bids")}
            className="cursor-pointer"
          >
            My Bids
          </span>
          &nbsp;&gt;&nbsp;
          <span className="text-seclightgray">{details.machinery_name}</span>
        </p>

        {/* CARD */}
        <div className="bg-white border border-border rounded-[10px] p-[25px] mb-5">
          {/* HEADER */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <h2 className="text-[#000000] text-2xl font-semibold">
              {details.machinery_name}
            </h2>

            <div className="flex items-center gap-2">
              <span className="px-[10px] py-1 text-xs rounded-[10px] bg-border text-secgray">
                {details.user_full_name}
              </span>
              <span
                className={`px-[22px] py-2 text-xs rounded-[10px] text-white ${
                  details.status === "Active"
                    ? "bg-[#3C97FF]"
                    : details.status === "sold"
                    ? "bg-[#35BB63]"
                    : "bg-[#FF4D4F]"
                }`}
              >
                {details.status === "sold" ? "Won" : details.status}
              </span>
            </div>
          </div>

          {/* INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-[#8A8A8A] mb-1">End Bid Date:</p>
              <p className="text-secgray font-medium">
                {formatDateTime(details.bid_end_time)}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#8A8A8A] mb-1">Start Bid Price:</p>
              <p className="text-secgray font-medium">
                {formatPrice(details.start_bid_price)}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#8A8A8A] mb-1">My Bid:</p>
              <p className="text-secgray font-medium">
                {formatPrice(details.my_bid)}
              </p>
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
      <div className="text-center py-10 text-gray-500">
        No bids found
      </div>
    )}

    {!loading &&
      rows.map((row) => (
        <div
          key={row.id}
         className={`border border-border rounded-xl p-4 space-y-2
  ${row.isHighlighted ? highlightClass : "bg-white"}
`}
        >
          <div className="flex items-center gap-2">
            {row.isHighlighted && (
              <span className="w-2 h-2 rounded-full bg-[#3C97FF]" />
            )}
            <p className="font-semibold text-secgray">
              {row.user_name}
            </p>
          </div>

          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Last Bid</span>
              <span className="font-semibold">
                ${row.last_bid.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Bid Time</span>
              <span className="text-right">
                {row.bidding_date}
              </span>
            </div>
          </div>
        </div>
      ))}
  </div>
) : (
  <MyBidDataTable data={rows} loading={loading} />
)}
      </div>
    </section>
  );
}

export default MyBidDetails;
