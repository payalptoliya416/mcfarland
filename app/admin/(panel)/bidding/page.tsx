"use client";

import AdminDataTable, { Column } from "@/components/tables/AdminDataTable";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { adminBiddingService } from "@/api/admin/bidding";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useIsMobile } from "@/hooks/useIsMobile";
import BiddingMobileCard from "@/adminpanel/BiddingMobileCard";
import Loader from "@/components/common/Loader";
import { HiArrowPath, HiOutlineEye } from "react-icons/hi2";
import { formatPrice } from "@/hooks/formate";
import { TooltipWrapper } from "@/adminpanel/TooltipWrapper";
import BiddingStatusDropdown from "@/adminpanel/BiddingStatusDropdown";

/* ================= TYPES ================= */
export type BiddingRow = {
  id: number;
  auction_id: string | number;
  name: string;
  year: string;
  make: string;
  model: string;
  bid_end_time: string;
  bid_start_price: string;
  bid_status: "active" | "pending" | "sold" | "cancelled";
  bids_count: number;
};

export default function BiddingManagement() {
  const router = useRouter();
  const isMobile = useIsMobile();
  /* ================= STATE ================= */
  const [data, setData] = useState<BiddingRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [pagination, setPagination] = useState<any>(null);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const [loadingViewId, setLoadingViewId] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setLoadingViewId(null);
  }, [pathname]);
  /* ================= FETCH ================= */
  const fetchBidding = async () => {
    try {
      setLoading(true);

      const res = await adminBiddingService.list({
        search,
        sort_by: sortBy,
        sort_order: sortOrder,
        page,
        per_page: perPage,
      });

      if (!res.data || res.data.length === 0) {
        setData([]);
        setPagination(res.pagination);
        setNoDataMessage(res.message || "No bidding data found");
        return;
      }

      const mapped: BiddingRow[] = res.data.map((item) => ({
        id: item.id,
        auction_id: item.auction_id,
        name: item.name,
        year: item.year,
        make: item.make,
        model: item.model,
        bid_end_time: new Date(item.bid_end_time).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        bid_start_price: `${formatPrice(item.bid_start_price)}`,
        bid_status: item.bid_status,
        bids_count: item.bids_count,
      }));
      setData(mapped);
      setPagination(res.pagination);
    } catch (error) {
      console.error("Error fetching bidding data:", error);
      toast.error("Failed to fetch bidding data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBidding();
  }, [search, page, perPage, sortBy, sortOrder]);

  /* ================= COLUMNS ================= */
  const columns: Column<BiddingRow>[] = [
 
    {
      key: "name",
      header: "Machinery Name",
      sortable: true,
      onSort: () => {
        setSortBy("name");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
       {
      key: "auction_id",
      header: "Auction ID",
      sortable: true,
      onSort: () => {
        setSortBy("auction_id");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
      render: (row) => <span className="font-medium">{row.auction_id}</span>,
    },
    {
      key: "bids_count",
      header: "Total Bid",
      sortable: true,
      onSort: () => {
        setSortBy("bids_count");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    {
      key: "bid_end_time",
      header: "Bid End Time",
      sortable: true,
      onSort: () => {
        setSortBy("bid_end_time");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    {
      key: "bid_start_price",
      header: "Bid Start Price",
      sortable: true,
      onSort: () => {
        setSortBy("bid_start_price");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    {
      key: "bid_status",
      header: "Status",
      render: (row) => {
        const statusMap: Record<string, string> = {
          active: "bg-[#34C759] text-white", // Green
          pending: "bg-[#FFCA42] text-black", // Yellow
          completed: "bg-[#2196F3] text-white", // Red
          cancelled: "bg-red-500 text-white"
        };

        const statusDisplay: Record<string, string> = {
          active: "Active",
          pending: "Pending",
          completed: "Completed",
          cancelled:"Cancelled"
        };

        return (
          <span
            className={`px-4 py-2 rounded-md text-sm w-[100px] text-center inline-block ${
              statusMap[row.bid_status] || "bg-gray-300 text-black"
            }`}
          >
            {statusDisplay[row.bid_status] || "Unknown"}
          </span>
        );
      },
    },
  //   {
  //   key: "bid_status",
  //   header: "Status",
  //    sortable: true,
  //   render: (r) => (
  //     <BiddingStatusDropdown
  //       value={r.bid_status}
  //       biddingId={r.id}
  //       onUpdated={fetchBidding}
  //     />
  //   ),
  // },
    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <div className="flex items-center">
          <TooltipWrapper content="View bidding details">
            <button
              disabled={loadingViewId === r.id}
              onClick={() => {
                setLoadingViewId(r.id);
                router.push(`/admin/bidding/bidding-list?id=${r.id}`);
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#3C97FF] cursor-pointer"
            >
              {loadingViewId === r.id ? (
                <HiArrowPath
                  size={18}
                  className="text-[#3C97FF] animate-spin"
                />
              ) : (
                <HiOutlineEye size={18} />
              )}
            </button>
          </TooltipWrapper>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 bg-white border border-border rounded-[14px] p-3 sm:p-5">
      {/* TOP BAR */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative w-[220px]">
          <FiSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-seclightgray"
          />
          <input
            type="text"
            placeholder="Search bidding..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full py-[12px] pl-[44px] pr-4 text-sm border rounded-lg border-border"
          />
        </div>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {loading && (
            <p className="flex justify-center items-center h-full">
              <Loader />
            </p>
          )}

          {!loading && data.length === 0 && (
            <p className="text-center text-sm text-gray-500">{noDataMessage}</p>
          )}

          {data.map((item) => (
            <BiddingMobileCard
              key={item.id}
              item={item}
                loadingViewId={loadingViewId}
    onEdit={() => {
      setLoadingViewId(item.id);
      router.push(`/admin/bidding/bidding-list?id=${item.id}`);
    }}
            />
          ))}
        </div>
      ) : (
        <AdminDataTable
          columns={columns}
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPage(1);
            setPerPage(size);
          }}
          noDataMessage={noDataMessage}
        />
      )}
   
    </div>
  );
}
