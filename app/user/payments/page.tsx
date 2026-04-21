'use client'

import DataTable, { Column } from "@/components/tables/DataTable";
import { useState } from "react";
import { FiDownload, FiSearch } from "react-icons/fi";

type Payment = {
  id: string;
  orderId: string;
  date: string;
  method: string;
  amount: string;
  status: "Paid" | "Failed" | "Pending";
};

const payments: Payment[] = [
  { id: "TXN-458912", orderId: "#ID1356", date: "May, 10 2025", method: "Credit Card (Visa)", amount: "$45,000", status: "Paid" },
  { id: "TXN-458753", orderId: "#ID1299", date: "May, 10 2025", method: "Bank Transfer", amount: "$60,000", status: "Paid" },
  { id: "TXN-457845", orderId: "#ID1240", date: "May, 10 2025", method: "PayPal", amount: "$45,000", status: "Failed" },
  { id: "TXN-456972", orderId: "#ID1203", date: "May, 10 2025", method: "Credit Card (Mastercard)", amount: "$45,000", status: "Paid" },
  { id: "TXN-456421", orderId: "#ID1159", date: "May, 10 2025", method: "Bank Transfer", amount: "$60,000", status: "Failed" },
  { id: "TXN-458752", orderId: "#ID1356", date: "May, 10 2025", method: "Credit Card (Visa)", amount: "$45,000", status: "Pending" },
  { id: "TXN-458919", orderId: "#ID1299", date: "May, 10 2025", method: "PayPal", amount: "$60,000", status: "Paid" },
  { id: "TXN-457841", orderId: "#ID1240", date: "May, 10 2025", method: "PayPal", amount: "$45,000", status: "Pending" },
  { id: "TXN-458751", orderId: "#ID1203", date: "May, 10 2025", method: "Credit Card (Mastercard)", amount: "$60,000", status: "Paid" },
];

function Payment() {
  const [search, setSearch] = useState("");
   const columns: Column<Payment>[] = [
    { key: "id", header: "Transaction ID", sortable: true },
    { key: "orderId", header: "Order ID", sortable: true },
    {
      key: "date",
      header: "Purchase Date",
      render: (row) => (
        <span className="text-sm leading-[14px] bg-border text-para px-[10px] py-1 rounded-sm">
          {row.date}
        </span>
      ),
      sortable: false,
    },
    { key: "method", header: "Payment Method" },
    { key: "amount", header: "Amount", sortable: true },

    {
      key: "status",
      header: "Status",
      render: (row) => {
        const color: any = {
          Paid: "bg-[#35BB63] text-white",
          Failed: "bg-[#DD3623] text-white",
          Pending: "bg-[#FFCA42] text-gray",
        };

        return (
          <span className={`px-[11px] py-2 w-[85px] rounded-md text-sm leading-[14px] block text-center  ${color[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
  ];

  const downloadInvoice = () => {
  // CSV HEADER
  const headers = ["Transaction ID", "Order ID", "Date", "Method", "Amount", "Status"];

  // ROWS
  const rows = payments.map((p) => [
    p.id,
    p.orderId,
    p.date,
    p.method,
    p.amount,
    p.status,
  ]);

  // Convert to CSV text
  let csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((e) => e.join(",")).join("\n");

  // Create hidden download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "payment_invoice.csv");
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
};


  return (
    <section className="py-11 sm:py-[60px]">
      <div className="container-custom mx-auto">
        <h1 className="text-secgray text-[26px] font-bold mb-[35px]">
          Delivery Tracking
        </h1>
        
        {/* Search + Button Row */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="relative w-72">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-seclightgray" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full h-12 pl-12 pr-4 rounded-lg border border-border"
            />
          </div>

          <button className="border rounded-lg px-5 py-[14px] flex items-center gap-[10px] gradient-btn text-white shadow-sm leading-[14px] cursor-pointer"  onClick={downloadInvoice}>
            <FiDownload size={18} /> Download Invoice
          </button>
        </div>

         <DataTable
          columns={columns}
          data={payments}
          searchKey="id"
          searchValue={search}
        />
      </div>
    </section>
  );
}

export default Payment;
