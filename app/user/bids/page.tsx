"use client";

import { bidService } from "@/api/user/bids";
import Loader from "@/components/common/Loader";
import DataTable, { Column } from "@/components/tables/DataTable";
import { formatPrice } from "@/hooks/formate";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineEye, HiArrowPath } from "react-icons/hi2";

type Bid = {
  id: string;
  image: string;
  machinery: string;
  currentBid: string;
  lastBid: string;
  timeLeft: string;
  status: "Active" | "Paid" | "Expired" | "Won";
};
function MyBidCard({ row, onView ,loading}: { row: Bid; onView: () => void ,loading: boolean;}) {
  const statusStyles: Record<string, string> = {
    Active: "bg-[#3C97FF] text-white",
    Sold: "bg-[#F05555] text-white",
    Won: "bg-[#35BB63] text-white",
    Outbid: "bg-[#FFCA42] text-black",
  };

  return (
    <div className="border border-border rounded-xl p-4 bg-white space-y-3">
      {/* TOP */}
      <div className="flex items-center gap-3">
        <Image
          src={row.image}
          alt={row.machinery}
          width={48}
          height={48}
          className="rounded-md object-cover"
        />
        <p className="font-semibold text-secgray text-sm">
          {row.machinery}
        </p>
      </div>

      {/* INFO */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Start Bid</p>
          <p className="font-semibold">{row.currentBid}</p>
        </div>

        <div>
          <p className="text-gray-500">Last Bid</p>
          <p className="font-semibold">{row.lastBid}</p>
        </div>

        <div className="col-span-2">
          <p className="text-gray-500">End Date</p>
          <span className="inline-block bg-[#F3F4F6] px-3 py-1 rounded text-xs">
            {row.timeLeft}
          </span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between">
        <span
          className={`px-4 py-1 rounded text-xs ${
            statusStyles[row.status] || "bg-gray-300 text-black"
          }`}
        >
          {row.status}
        </span>

        <button
  onClick={onView}
  disabled={loading}
  className="text-[#3C97FF] text-sm font-medium"
>
  {loading ? (
    <HiArrowPath size={18} className="animate-spin" />
  ) : (
    <HiOutlineEye size={18} />
  )}
</button>
      </div>
    </div>
  );
}

export default function Bids() {
  const [search, setSearch] = useState("");
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null);
  
  const formatEndDate = (date: string) => {
  const d = new Date(date);

  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).replace(",", "")
};

 const fetchBids = async () => {
  try {
    setLoading(true);
    const res = await bidService.getMyBids();

    if (res.success) {
      const mapped: Bid[] = res.data.map((item) => ({
        id: String(item.id),
        image: item.first_image || "",
        machinery: item.name,
        currentBid: `${formatPrice(item.bid_start_price)}`,
        lastBid: `${formatPrice(item.last_bid)}`,
         timeLeft: formatEndDate(item.bid_end_time),
        status: item.status === "sold" ? "Won" : item.status,
      }));

      setBids(mapped);
    }
  } catch (error) {
    console.error("Failed to fetch bids", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchBids();
  }, []);

  const columns: Column<Bid>[] = [
    {
      key: "image",
      header: "Image",
      render: (row) => (
        <Image
          src={row.image}
          alt={row.machinery}
          width={40}
          height={40}
          className="rounded-md object-cover"
        />
      ),
      className: "w-[80px]",
    },

    {
      key: "machinery",
      header: "Machinery",
      accessor: (r) => r.machinery,
      sortable: true,
    },

    { key: "currentBid", header: "Start Bid Price", sortable: true },
    { key: "lastBid", header: "Last Bid", sortable: true },
   {
    key: "timeLeft",
    header: "End Bid Date",
    sortable: true,
    render: (row) => (
      <span
        className="
          inline-flex items-center
          px-3 py-1.5
          rounded-md
          bg-[#F3F4F6]
          text-secgray
          text-sm
          font-medium
          whitespace-nowrap
        "
      >
        {row.timeLeft}
      </span>
    ),
  },

   {
  key: "status",
  header: "Bid Status",
  render: (row) => {
    // normalize status (case-insensitive)
    const status = row.status?.toLowerCase();

    const statusStyles: Record<string, string> = {
      active: "bg-[#3C97FF] text-white text-center",
      sold: "bg-[#F05555] text-white text-center",
      won: "bg-[#35BB63] text-white text-center",
      outbid: "bg-[#FFCA42] text-black text-center",
    };

    const statusLabel: Record<string, string> = {
      active: "Active",
      sold: "Sold",
      won: "Won",
      outbid: "Outbid",
    };

    return (
      <span
        className={`px-[22px] py-2 w-[85px] rounded-md text-sm leading-[14px] block ${
          statusStyles[status] || "bg-gray-300 text-black"
        }`}
      >
        {statusLabel[status] || row.status}
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
          router.push(`/user/bids/bid-details?id=${row.id}`);
        }}
        className="cursor-pointer flex items-center justify-center"
      >
        {isLoading ? (
          <HiArrowPath
            size={20}
            className="text-[#3C97FF] animate-spin"
          />
        ) : (
          <HiOutlineEye
            size={20}
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
        {/* Search + Buttons */}
        <div className="flex justify-between mb-5 items-center flex-wrap gap-5">
          {/* Search */}
          <h1 className="text-secgray text-[26px] font-bold">My Bids</h1>
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
       <div className="flex justify-center items-center min-h-[50vh]">
      <Loader />
      </div>
    ) : bids.length === 0 ? (
      <p className="text-center text-sm text-gray-400">
        No bids found
      </p>
    ) : (
      bids.map((row) => (
        <MyBidCard
          key={row.id}
          row={row}
           loading={loadingRowId === row.id}
          onView={() =>
            router.push(`/user/bids/bid-details?id=${row.id}`)
          }
        />
      ))
    )}
  </div>
) : (
  <DataTable
    columns={columns}
    data={bids}
    searchKey="machinery"
    searchValue={search}
    loading={loading}
  />
)}

      </div>
    </section>
  );
}
