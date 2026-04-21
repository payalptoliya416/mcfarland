"use client";

import AdminDataTable, { Column } from "@/components/tables/AdminDataTable";
import { FiSearch } from "react-icons/fi";
import { HiArrowPath, HiOutlineEye } from "react-icons/hi2";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { adminWonUsersService } from "@/api/admin/biddingWonUsers";
import { useIsMobile } from "@/hooks/useIsMobile";
import WonUserMobileCard from "@/adminpanel/WonUserMobileCard";
import Loader from "@/components/common/Loader";
import { formatPrice } from "@/hooks/formate";
import { TooltipWrapper } from "@/adminpanel/TooltipWrapper";

/* ================= TYPES ================= */

type WonUserRow = {
  id: number;
  userName: string;
  machineryName: string;
  phone: string;
  wonBidPrice: string;
  status: "Pending" | "Send" | "Signed" | "Rejected" | "Approved" | "Unknown";
  contractUrl: string | null;
};

/* ================= STATUS COLORS ================= */

const statusClassMap: Record<WonUserRow["status"], string> = {
  Pending: "bg-[#FFCA42] text-black",
  Send: "bg-[#A855F7] text-white",
  Rejected: "bg-[#EF4444] text-white",
  Signed: "bg-[#3B82F6] text-white",
  Approved: "bg-[#22C55E] text-white",
  Unknown: "bg-gray-400 text-white",
};

export default function WonUser() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [data, setData] = useState<WonUserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const [loadingViewId, setLoadingViewId] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setLoadingViewId(null);
  }, [pathname]);
  /* ================= FETCH ================= */

  const fetchWonUsers = async () => {
    try {
      setLoading(true);

      const res = await adminWonUsersService.list({
        search,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      if (!res?.data || res.data.length === 0) {
        setData([]); // ✅ clear old rows
        setPagination(res.pagination ?? null);
        setNoDataMessage(res.message || "No won users found");
        return;
      }

      const mapped: WonUserRow[] = res.data.map((item) => ({
        id: item.machinery_id,
        userName: item.user_full_name,
        machineryName: item.machinery_name,
        phone: item.phone_no,
        wonBidPrice: `${formatPrice(item.won_bid_amount)}`,
        status: item.contract_status,
        contractUrl: item.contract_file_url,
      }));

      setData(mapped);
      setPagination(res.pagination);
      setNoDataMessage(null); // ✅ reset message
    } catch (error) {
      console.error(error);
      setData([]);
      setPagination(null);
      setNoDataMessage("Failed to fetch won users");
      toast.error("Failed to fetch won users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWonUsers();
  }, [search, page, perPage, sortBy, sortOrder]);

  /* ================= COLUMNS ================= */

  const columns: Column<WonUserRow>[] = [
    {
      key: "userName",
      header: "Won User Name",
      sortable: true,
      onSort: () => {
        setSortBy("user_full_name");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    {
      key: "machineryName",
      header: "Machinery Name",
      sortable: true,
      onSort: () => {
        setSortBy("machinery_name");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    {
      key: "phone",
      header: "Phone Number",
    },
    {
      key: "wonBidPrice",
      header: "Won Bid Price",
      sortable: true,
      onSort: () => {
        setSortBy("won_bid_amount");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`px-4 py-2 rounded-md text-sm inline-block w-[100px] text-center ${
            statusClassMap[row.status]
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <TooltipWrapper content="View won user">
          <button
            disabled={loadingViewId === row.id}
            onClick={() => {
              setLoadingViewId(row.id);
              router.push(`/admin/won-user/won-user-details/?id=${row.id}`);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full text-blue-500 cursor-pointer"
          >
            {loadingViewId === row.id ? (
              <HiArrowPath size={18} className="text-blue-500 animate-spin" />
            ) : (
              <HiOutlineEye size={18} />
            )}
          </button>
        </TooltipWrapper>
      ),
    },
  ];

  return (
    <div className="space-y-5 bg-white border border-border rounded-[14px] p-3 sm:p-5">
      <div className="relative w-[220px]">
        <FiSearch
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-seclightgray"
        />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-full py-[12px] pl-[44px] pr-4 text-sm border rounded-lg border-border"
        />
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
            <WonUserMobileCard
              key={item.id}
              item={item}
              loading={loadingViewId === item.id}
    onView={() => {
      setLoadingViewId(item.id);
      router.push(
        `/admin/won-user/won-user-details/?id=${item.id}`,
      );
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
