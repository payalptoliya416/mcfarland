"use client";

import Image from "next/image";
import { MyBidRow } from "./MyBiddingListTable";

export default function MyBiddingListMobileCard({
  bid,
}: {
  bid: MyBidRow;
}) {
  return (
    <div
      className={`border border-border rounded-xl p-4 space-y-3 bg-white
        ${bid.isWon ? "bg-[#E6F9EF]" : bid.isHighlighted ? "bg-[#FFF7E3]" : ""}
      `}
    >
      {/* USER */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-secgray">
            {bid.user_name}
          </p>
          <p className="text-xs text-gray-500">{bid.email}</p>
        </div>

        {bid.isWon && (
          <span className="flex items-center gap-1 text-xs bg-[#35BB63] text-white px-2 py-1 rounded">
            <Image src="/assets/won.png" alt="won" width={12} height={12} />
            Won
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="text-sm space-y-2">
        <Row label="Phone" value={bid.phone} />
        <Row label="Bid Time" value={bid.bidding_date} />
        <Row
          label="Bid Amount"
          value={`$${bid.last_bid.toLocaleString()}`}
          strong
        />
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
