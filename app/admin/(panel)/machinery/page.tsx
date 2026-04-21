"use client";

import AdminDataTable, { Column } from "@/components/tables/AdminDataTable";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { HiArrowPath, HiOutlineTrash } from "react-icons/hi2";
import { adminMachineryService } from "@/api/admin/machinery";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/tables/ConfirmDialog";
import { useIsMobile } from "@/hooks/useIsMobile";
import MachineryMobileCard from "@/adminpanel/MachineryMobileCard";
import { formatPrice } from "@/hooks/formate";
import { TooltipWrapper } from "@/adminpanel/TooltipWrapper";
import MachineryStatusDropdown from "@/adminpanel/MachineryStatusDropdown";
/* ================= TYPES ================= */
export type MachineryRow = {
  id: number;
  auction_id: number | string;
  image_urls: string;
  title: string;
  category: string;
  year: string;
  workingHours: string;
  buyNowPrice: string;
  bidStartPrice: string;
  status: 0 | 1 | 2;
};

export default function Machinery() {
  const router = useRouter();
  const isMobile = useIsMobile();
  /* ================= STATE ================= */
  const [data, setData] = useState<MachineryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [pagination, setPagination] = useState<any>(null);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refreshId, setRefreshId] = useState<number | null>(null);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [loadingEditId, setLoadingEditId] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setLoadingEditId(null);
  }, [pathname]);
  const fetchMachinery = async () => {
    try {
      setLoading(true);
      setData([]);
      const res = await adminMachineryService.list({
        search,
        sort_by: sortBy,
        sort_order: sortOrder,
        page,
        per_page: perPage,
      });

      if (!res?.data || res.data.length === 0) {
        setData([]);
        setPagination(res.pagination ?? null);
        setNoDataMessage(res.message || "No machinery found");
        return;
      }

      const mapped: MachineryRow[] = res.data.map((item) => ({
        id: item.id,
        auction_id: item.auction_id,
        image_urls: item.image_urls?.[0] || "",
        title: `${item.make} ${item.model}`,
        category: item.category?.category_name ?? "-",
        year: item.year,
        workingHours: `${item.working_hours} hrs`,
        buyNowPrice: `${formatPrice(item.buy_now_price)}`,
        bidStartPrice: `${formatPrice(item.bid_start_price)}`,
        status: item.status as 0 | 1 | 2,
      }));

      setData(mapped);
      setPagination(res.pagination);
      setNoDataMessage(null);
    } catch (error) {
      console.error(error);
      setData([]);
      setPagination(null);
      setNoDataMessage("Failed to fetch machinery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachinery();
  }, [search, page, perPage, sortBy, sortOrder]);

  /* ================= COLUMNS ================= */
  const columns: Column<MachineryRow>[] = [
    {
      key: "image_urls",
      header: "Image",
      render: (row) =>
        row.image_urls && (
          <div className="relative w-[44px] h-[44px] overflow-hidden rounded-lg">
            <Image
              src={row.image_urls}
              alt={row.title}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
        ),
      className: "w-[80px]",
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      onSort: () => {
        setSortBy("make");
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
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      onSort: () => {
        setSortBy("category_id");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    {
      key: "year",
      header: "Year",
      sortable: true,
      onSort: () => {
        setSortBy("year");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    { key: "workingHours", header: "Working Hours" },
    {
      key: "buyNowPrice",
      header: "Buy Now Price",
      sortable: true,
      onSort: () => {
        setSortBy("buy_now_price");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    {
      key: "bidStartPrice",
      header: "Bid Start Price",
      sortable: true,
      onSort: () => {
        setSortBy("bid_start_price");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      onSort: () => {
        setSortBy("status");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
      render: (row) => (
        <MachineryStatusDropdown
          value={row.status}
          machineryId={row.id}
          onUpdated={fetchMachinery}
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-3">
          <TooltipWrapper content="Edit machinery">
            <button
              disabled={loadingEditId === row.id}
              onClick={() => {
                setLoadingEditId(row.id);
                router.push(`/admin/machinery/add?id=${row.id}`);
              }}
              className="flex items-center justify-center"
            >
              {loadingEditId === row.id ? (
                <HiArrowPath
                  size={18}
                  className="text-[#EDB423] animate-spin "
                />
              ) : (
                <BiEdit size={18} className="text-[#EDB423] cursor-pointer" />
              )}
            </button>
          </TooltipWrapper>
          <TooltipWrapper content="Delete machinery">
            <HiOutlineTrash
              className="text-[#DD3623] cursor-pointer"
              size={18}
              onClick={() => setDeleteId(row.id)}
            />
          </TooltipWrapper>
          {row.status === 2 && (
              <TooltipWrapper content="Regenerate Auction ID">
                <HiArrowPath
                  className="text-[#2F80ED] cursor-pointer"
                  size={18}
                  onClick={() => setRefreshId(row.id)}
                />
              </TooltipWrapper>
            )}
        </div>
      ),
      className: "w-[120px]",
    },
  ];

  const handleRefreshAuctionId = async (id: number) => {
    try {
      setRefreshLoading(true);

      const res = await adminMachineryService.regenerateAuctionId(id);

      if (res?.status) {
        toast.success(res.message || "Auction ID regenerated successfully");
        fetchMachinery();
      }
    } catch {
      toast.error("Failed to regenerate auction ID");
    } finally {
      setRefreshLoading(false);
    }
  };
  const confirmRefresh = async () => {
    if (!refreshId) return;

    try {
      await handleRefreshAuctionId(refreshId);
      setRefreshId(null); // close modal
    } finally {
      setRefreshLoading(false);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);

      const res = await adminMachineryService.delete(id);

      if (res?.status) {
        toast.success(res.message || "Machinery deleted successfully");

        // ✅ pagination safe logic
        if (data.length === 1 && page > 1) {
          setPage((p) => p - 1);
        } else {
          fetchMachinery();
        }
      }
    } catch {
      toast.error("Failed to delete machinery");
    } finally {
      setLoading(false);
    }
  };
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);
      await handleDelete(deleteId); // 🔥 reuse existing logic
      setDeleteId(null); // close modal
    } finally {
      setDeleteLoading(false);
    }
  };
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-[70vh]">
  //       <Loader />
  //     </div>
  //   );
  // }
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
            placeholder="Search machinery..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full py-[12px] pl-[44px] pr-4 text-sm border rounded-lg border-border"
          />
        </div>

        <button
          onClick={() => router.push("/admin/machinery/add")}
          className=" gradient-btn px-5 py-[12px] text-sm text-white rounded-lg cursor-pointer transition-all duration-200 ease-in-out
        hover:brightness-110 hover:shadow-md active:brightness-90 active:scale-95"
        >
          + Add Machinery
        </button>
      </div>
      {isMobile ? (
        <div className="space-y-4">
          {/* {loading &&  <div className="flex justify-center items-center h-full"><Loader/></div>} */}

          {!loading && data.length === 0 && (
            <p className="text-center text-gray-500">{noDataMessage}</p>
          )}

          {data.map((item) => (
            <MachineryMobileCard
              key={item.id}
              item={item}
              loadingEditId={loadingEditId}
              onEdit={() => {
                setLoadingEditId(item.id);
                router.push(`/admin/machinery/add?id=${item.id}`);
              }}
              onDelete={() => setDeleteId(item.id)}
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

      <ConfirmModal
        open={deleteId !== null}
        title="Delete Machinery"
        description="Are you sure you want to delete this machinery? This action cannot be undone."
        confirmText="Yes, Delete"
        loadingText="Deleting..."
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />

      <ConfirmModal
        open={refreshId !== null}
        title="Regenerate Auction ID"
        description="Are you sure you want to regenerate the auction ID?"
        confirmText="Yes"
        loadingText="Regenerating..."
        confirmVariant="primary"
        loading={refreshLoading}
        onConfirm={confirmRefresh}
        onClose={() => setRefreshId(null)}
      />
    </div>
  );
}
