"use client";

import { MyBidRow } from "./MyBiddingListTable";

export default function MyBidMobileCard({ bid }: { bid: MyBidRow }) {
  return (
    <div
      className={`border border-border rounded-xl p-4 space-y-3 bg-white
        ${bid.isHighlighted ? "bg-[#FFF7E3]" : ""}
      `}
    >
      {/* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {bid.isHighlighted && (
            <span className="w-2 h-2 rounded-full bg-[#3C97FF]" />
          )}
          <p className="font-semibold text-secgray">
            {bid.user_name}
          </p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="text-sm space-y-2">
        <Row label="Last Bid" value={`$${bid.last_bid.toLocaleString()}`} strong />
        <Row label="Bid Time" value={bid.bidding_date} />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: any;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className={`text-right ${strong ? "font-semibold" : ""}`}>
        {value}
      </span>
    </div>
  );
}
