"use client";

import React from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Loader from "../common/Loader";

/* ================= COLUMN TYPE ================= */
export type Column<T> = {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  onSort?: () => void;
  render?: (row: T) => React.ReactNode;
  accessor?: (row: T) => React.ReactNode;
  className?: string;
};

/* ================= PAGINATION TYPE ================= */
type Pagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
};

/* ================= PROPS ================= */
type Props<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
  noDataMessage? : string | null;
  rowClassName?: (row: T, index: number) => string;
};

/* ================= COMPONENT ================= */
export default function AdminDataTable<
  T extends { id?: string | number }
>({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  onPageSizeChange,
  noDataMessage,
  className = "",
  rowClassName
}: Props<T>) {
  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-x-auto rounded-[10px] border border-border">
        <table className="w-full bg-white border-collapse">
          {/* HEADER */}
          <thead className="bg-[#FFEFCC]">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={String(col.key)}
                  className="text-sm py-[18px] px-[15px] border border-border whitespace-nowrap font-normal"
                >
                  <div
                    className={`flex items-center justify-between gap-2 ${
                      col.sortable ? "cursor-pointer" : ""
                    }`}
                    onClick={col.sortable ? col.onSort : undefined}
                  >
                    <span>{col.header}</span>

                    {col.sortable && (
                      <div className="flex flex-col leading-[0]">
                        <FaCaretUp size={10} />
                        <FaCaretDown size={10} />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-10 text-center text-gray-600"
                >
                  <div className="flex justify-center">
                 <Loader/>
                  </div>
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-10 text-center text-gray-600"
                >
                   {noDataMessage ? noDataMessage : "No Data found"}
                </td>
              </tr>
            )}

            {!loading &&
              data.map((row, idx) => (
                <tr
                key={(row.id ?? idx).toString()}
                  className={rowClassName ? rowClassName(row, idx) : (idx % 2 === 0 ? "bg-white" : "bg-[#F9F9F9]")}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`text-sm p-[16px] border border-border ${col.className ?? ""}`}
                    >
                      {col.render
                        ? col.render(row)
                        : col.accessor
                        ? col.accessor(row)
                        : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
    {pagination && (
      <div
        className="
          px-4 py-4 text-sm text-para
          flex flex-col gap-3
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        {/* LEFT INFO */}
        <div className="font-medium text-center sm:text-left">
          {pagination.from} – {pagination.to} of {pagination.total} results
        </div>

        {/* RIGHT CONTROLS */}
        <div
          className="
            flex items-center justify-center
            gap-3
            flex-wrap
            sm:flex-nowrap
          "
        >
          {/* PAGE SIZE */}
          <select
            value={pagination.per_page}
            onChange={(e) =>
              onPageSizeChange?.(Number(e.target.value))
            }
            className="
              border border-[#E0E0E0]
              rounded-md
              px-2 py-1
              text-sm
              focus:outline-none
              bg-white cursor-pointer
            "
          >
            {[10, 20, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          {/* FIRST */}
          <button
            disabled={pagination.current_page === 1}
            onClick={() => onPageChange?.(1)}
            className={`px-1 text-lg cursor-pointer ${
              pagination.current_page === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:text-black"
            }`}
          >
            ⏮
          </button>

          {/* PREV */}
          <button
            disabled={pagination.current_page === 1}
            onClick={() =>
              onPageChange?.(pagination.current_page - 1)
            }
            className={`px-1 text-lg cursor-pointer ${
              pagination.current_page === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:text-black"
            }`}
          >
            ‹
          </button>

          {/* PAGE INFO */}
          <span className="min-w-[50px] text-center font-medium">
            {pagination.current_page} / {pagination.last_page}
          </span>

          {/* NEXT */}
          <button
            disabled={pagination.current_page === pagination.last_page}
            onClick={() =>
              onPageChange?.(pagination.current_page + 1)
            }
            className={`px-1 text-lg cursor-pointer ${
              pagination.current_page === pagination.last_page
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:text-black"
            }`}
          >
            ›
          </button>

          {/* LAST */}
          <button
            disabled={pagination.current_page === pagination.last_page}
            onClick={() =>
              onPageChange?.(pagination.last_page)
            }
            className={`px-1 text-lg cursor-pointer ${
              pagination.current_page === pagination.last_page
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:text-black"
            }`}
          >
            ⏭
          </button>
        </div>
      </div>
    )}

    </div>
  );
}
