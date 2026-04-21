"use client";

import React, { useState, useMemo } from "react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import Loader from "../common/Loader";

/* ================= TYPES ================= */
export interface MyBidRow {
  id: string;
  user_name: string;
  last_bid: number;
  bidding_date: string;
  isHighlighted?: boolean;
}
interface MyBidDataTableProps {
  data: MyBidRow[];
  loading?: boolean;
}

type SortKey = "user_name"  | "last_bid" | "bidding_date";

/* ================= COMPONENT ================= */
export default function MyBidDataTable({
  data,
  loading = false,
}: MyBidDataTableProps) {
  
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  /* ================= SORTED DATA ================= */
  const sortedData = useMemo<MyBidRow[]>(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="w-full overflow-x-auto border border-border rounded-[10px] bg-white">
      <table className="w-full border-collapse">
        {/* ================= HEADER ================= */}
        <thead className="bg-[#FFEFCC]">
          <tr>
            {[
              { key: "user_name", label: "User Name" },
              { key: "last_bid", label: "Last Bid" },
              { key: "bidding_date", label: "Bidding Date" },
            ].map((col, idx) => (
              <th
                key={col.key}
                onClick={() => toggleSort(col.key as SortKey)}
                className={`px-[15px] py-[18px] text-sm font-medium text-secgray
                border border-border whitespace-nowrap cursor-pointer
                ${idx === 0 ? "rounded-tl-[10px]" : ""}
                ${idx === 3 ? "rounded-tr-[10px]" : ""}`}
              >
                <div className="flex items-center justify-between gap-2 cursor-pointer">
                  {col.label}
                  <div className="flex flex-col leading-none">
                    <FaCaretUp
                      size={10}
                      className={sortKey === col.key && sortDir === "asc"   ? "text-black": "text-gray-400"
                      }
                    />
                    <FaCaretDown
                      size={10}
                      className={
                        sortKey === col.key && sortDir === "desc"
                          ? "text-black"
                          : "text-gray-400"
                      }
                    />
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* ================= BODY ================= */}
        <tbody>
          {sortedData.map((row, idx) => {
            const bg = row.isHighlighted
          ? "bg-[#FFF7E3]" // My Bid
          : idx % 2 === 0
          ? "bg-white"
          : "bg-[#F9F9F9]";

            return (
              <tr key={row.id} className={`${bg} hover:bg-gray-50`}>
                {/* USER NAME */}
                <td className="px-[15px] py-[16px] border border-border">
                  <div className="flex items-center gap-2">
                    {row.isHighlighted && (
                    <span className="w-2 h-2 rounded-full bg-[#3C97FF]" />
                  )}

                    <span className="font-medium text-secgray whitespace-nowrap">
                      {row.user_name}
                    </span>
                  </div>
                </td>

                {/* LAST BID */}
                <td className="px-[15px] py-[16px] border border-border font-semibold text-secgray">
                  ${row.last_bid.toLocaleString()}
                </td>

                {/* DATE */}
                <td className="px-[15px] py-[16px] border border-border">
                  <span className="inline-block px-3 py-1 rounded-md bg-[#F2F2F2] text-xs whitespace-nowrap">
                    {row.bidding_date}
                  </span>
                </td>
              </tr>
            );
          })}

          {loading && (
            <tr>
              <td colSpan={4} className="py-10 text-center text-gray-500">
                <Loader/>
              </td>
            </tr>
          )}

          {!loading && sortedData.length === 0 && (
            <tr>
              <td colSpan={4} className="py-10 text-center text-gray-500">
                No bids found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
