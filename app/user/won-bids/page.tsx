"use client";

import { WonBidRow, wonBidService } from "@/api/user/bids";
import Loader from "@/components/common/Loader";
import DataTable, { Column } from "@/components/tables/DataTable";
import { formatPrice } from "@/hooks/formate";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineEye, HiArrowPath } from "react-icons/hi2";

const mapContractStatus = (
  status: "Pending" | "Completed" | "Signed" | "Approved" | "Rejected" | "Unknown"
): WonBidRow["contractStatus"] => {
  switch (status) {
    case "Completed":
    case "Signed":
      return "Signed";

    case "Pending":
      return "Pending";

    case "Approved":
      return "Approved";

    case "Rejected":
      return "Rejected";

    default:
      return "Unknown";
  }
};
function WonBidCard({
  row,
  onView,
    loading,
}: {
  row: WonBidRow;
  onView: () => void;
    loading: boolean;
}) {
  const statusStyles: Record<string, string> = {
    Pending: "bg-[#FFCA42] text-secgray",
    Approved: "bg-[#35BB63] text-white",
    Signed: "bg-[#3C97FF] text-white",
    Rejected: "bg-[#FF4D4F] text-white",
    Unknown: "bg-[#E5E7EB] text-secgray",
  };

  return (
    <div className="border border-border rounded-xl p-4 bg-white space-y-3">
      {/* TOP */}
      <div className="flex items-center gap-3">
        <Image
          src={row.image}
          alt={row.machinery}
          width={50}
          height={50}
          className="rounded-md object-cover"
        />
        <div>
          <p className="font-semibold text-sm text-secgray">
            {row.machinery}
          </p>
          <p className="text-xs text-gray-500">{row.category}</p>
        </div>
      </div>

      {/* INFO */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 mb-1">Won Amount</p>
          <p className="font-semibold">{row.wonBidAmount}</p>
        </div>

        <div>
          <p className="text-gray-500 col-span-2 mb-1">Won Date</p>
          <span className="inline-block bg-[#F3F3F3] px-2 py-1 rounded text-xs">
            {row.wonDate}
          </span>
        </div>

        <div className="col-span-2">
          <p className="text-gray-500 mb-1">Contract Status</p>
          <span
            className={`px-3 py-1 rounded text-xs inline-block ${
              statusStyles[row.contractStatus]
            }`}
          >
            {row.contractStatus}
          </span>
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <button
  onClick={onView}
  disabled={loading}
  className="text-[#3C97FF] text-sm font-medium flex items-center gap-2"
>
  {loading ? (
    <HiArrowPath size={16} className="animate-spin" />
  ) : (
    <>View →</>
  )}
</button>
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */
export default function MyWonBids() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<WonBidRow[]>([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null);

  /* ================= HELPERS ================= */
  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const router = useRouter();

  /* ================= API ================= */
  const fetchWonBids = async () => {
    try {
      setLoading(true);
      const res = await wonBidService.getWonBids(1);

      if (res.success) {
        const mapped: WonBidRow[] = res.data.map((item) => ({
          id: String(item.id),
          image: item.first_image || "",
          machinery: item.machinery_name,
          category: item.category, 
          wonBidAmount: formatPrice(item.won_bid_amount),
          wonDate: formatDateTime(item.won_date),
          contractStatus: mapContractStatus(item.contract_status),
        }));

        setRows(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch won bids", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWonBids();
  }, []);

  /* ================= COLUMNS ================= */
  const columns: Column<WonBidRow>[] = [
    {
      key: "image",
      header: "Image",
      className: "w-[80px]",
      render: (row) => (
        <Image
          src={row.image}
          alt={row.machinery}
          width={40}
          height={40}
          className="rounded-md object-cover"
        />
      ),
    },
    {
      key: "machinery",
      header: "Machinery",
      accessor: (r) => r.machinery,
      sortable: true,
    },
    {
      key: "category",
      header: "Category",
      accessor: (r) => r.category,
      sortable: true,
    },
    {
      key: "wonBidAmount",
      header: "Won Bid Amount",
      accessor: (r) => r.wonBidAmount,
      sortable: true,
    },
    {
      key: "wonDate",
      header: "Won Date",
      render: (row) => (
        <span className="bg-[#F3F3F3] px-3 py-1 rounded-md text-sm whitespace-nowrap">
          {row.wonDate}
        </span>
      ),
    },
    {
      key: "contractStatus",
      header: "Contract Status",
      render: (row) => {
        const styles: Record<string, string> = {
          Pending: "bg-[#FFCA42] text-secgray",
          Approved: "bg-[#35BB63] text-white",
          Signed: "bg-[#3C97FF] text-white",
          Rejected: "bg-[#FF4D4F] text-white",
          Unknown: "bg-[#E5E7EB] text-secgray",
        };

        return (
          <span
            className={`px-3 py-2 rounded-md text-sm inline-block min-w-[90px] text-center ${
              styles[row.contractStatus]
            }`}
          >
            {row.contractStatus}
          </span>
        );
      },
    },
    {
  key: "actions",
  header: "Actions",
  render: (row) => {
    const isLoading = loadingRowId === row.id;

    return (
      <button
        disabled={isLoading}
        onClick={() => {
          setLoadingRowId(row.id);
          router.push(`/user/won-bids/signaturepad?id=${row.id}`);
        }}
        className="cursor-pointer flex items-center justify-center"
      >
        {isLoading ? (
          <HiArrowPath
            size={18}
            className="text-[#3C97FF] animate-spin"
          />
        ) : (
          <HiOutlineEye
            size={18}
            className="text-[#3C97FF]"
          />
        )}
      </button>
    );
  },
},
  ];

  return (
    <section className="py-11 sm:py-[60px]">
      <div className="container-custom mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5 flex-wrap gap-5">
          <h1 className="text-secgray text-[26px] font-bold">
            My Won Bids
          </h1>

          <div className="relative w-72">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-seclightgray" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full h-12 pl-12 pr-4 rounded-lg border border-border"
            />
          </div>
        </div>

        {/* TABLE */}
        {isMobile ? (
  <div className="space-y-4">
    {loading ? (
        <div className="flex justify-center items-center h-full">
      <Loader />
      </div>
    ) : rows.length === 0 ? (
      <p className="text-center text-sm text-gray-400">
        No won bids found
      </p>
    ) : (
      rows.map((row) => (
        <WonBidCard
          key={row.id}
          row={row}
          loading={loadingRowId === row.id}
          onView={() =>
            router.push(`/user/won-bids/signaturepad?id=${row.id}`)
          }
        />
      ))
    )}
  </div>
) : (
  <DataTable
    columns={columns}
    data={rows}
    searchKey="machinery"
    searchValue={search}
    loading={loading}
  />
)}

      </div>
    </section>
  );
}
