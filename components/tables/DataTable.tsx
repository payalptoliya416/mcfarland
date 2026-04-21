"use client";

import React, { useState, useMemo } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Loader from "../common/Loader";

export type Column<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  accessor?: (row: T) => React.ReactNode;
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T;
  searchValue?: string;   
  className?: string;
  loading? : boolean;
};

export default function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  searchKey,
  searchValue = "",
  className = "",
  loading 
}: Props<T>) {
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // SEARCH + SORT
  const processedData = useMemo(() => {
    let filtered = [...data];

    if (searchKey && searchValue.trim() !== "") {
      filtered = filtered.filter((item) =>
        String(item[searchKey]).toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (!sortColumn) return filtered;

    return filtered.sort((a: any, b: any) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, searchValue, sortColumn, sortDir]);

  const toggleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(key);
      setSortDir("asc");
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-x-auto rounded-[10px] border border-border">
        <table className="w-full bg-white border-collapse">
          {/* HEADER */}
          <thead className="bg-[#FFEFCC]">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col.key}
                  className={`text-sm py-[18px] px-[15px] border border-border whitespace-nowrap ${
                    index === 0 ? "rounded-tl-[10px]" : ""
                  } ${index === columns.length - 1 ? "rounded-tr-[10px]" : ""}`}
                >
                  <div
                    className={`flex items-center justify-between gap-2 text-gray font-normal ${
                      col.sortable ? "cursor-pointer" : ""
                    }`}
                    onClick={() => col.sortable && toggleSort(col.key)}
                  >
                    <span>{col.header}</span>

                    {col.sortable && (
                      <div className="flex flex-col leading-[0]">
                        <FaCaretUp
                          size={10}
                          className={
                            sortColumn === col.key && sortDir === "asc"
                              ? "text-black"
                              : "text-gray-400"
                          }
                        />
                        <FaCaretDown
                          size={10}
                          className={
                            sortColumn === col.key && sortDir === "desc"
                              ? "text-black"
                              : "text-gray-400"
                          }
                        />
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
        className="p-10 text-center"
      >
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      </td>
    </tr>
  )}

             {!loading && processedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-8 text-center text-gray-600"
                >
                  No records found
                </td>
              </tr>
            )}
 {!loading &&
            processedData.map((row, idx) => {
              const bg = idx % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#F9F9F9]";

              return (
                <tr
                  key={(row.id ?? idx).toString()}
                  className={`${bg} hover:bg-gray-50 transition`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`text-sm p-[16px] border border-border whitespace-nowrap text-secgray ${col.className ?? ""}`}
                    >
                      {col.render
                        ? col.render(row)
                        : col.accessor
                        ? col.accessor(row)
                        : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
