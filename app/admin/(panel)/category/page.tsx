"use client";

import AdminDataTable, { Column } from "@/components/tables/AdminDataTable";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { HiArrowPath, HiOutlineTrash } from "react-icons/hi2";
import { adminCategoryService } from "@/api/admin/category";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/tables/ConfirmDialog";
import { useIsMobile } from "@/hooks/useIsMobile";
import CategoryMobileCard from "@/adminpanel/CategoryMobileCard";
import Loader from "@/components/common/Loader";
import { TooltipWrapper } from "@/adminpanel/TooltipWrapper";

/* ================= TYPES ================= */
export type CategoryRow = {
  id: number;
  image_urls: string | null;
  categoryName: string;
  totalMachinery: number;
  createdDate: string;
  lastUpdated: string;
};

export default function AdminCategory() {
  const router = useRouter();

  /* ================= STATE ================= */
  const [data, setData] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const isMobile = useIsMobile();
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const [loadingEditId, setLoadingEditId] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setLoadingEditId(null);
  }, [pathname]);
  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await adminCategoryService.getCategories({
        search,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      if (!res?.data || res.data.length === 0) {
        setData([]);
        setPagination(res.pagination ?? null);
        setNoDataMessage(res.message || "No categories found");
        return;
      }

      const mapped: CategoryRow[] = res.data.map((item) => ({
        id: item.id,
        image_urls: item.image_urls?.length ? item.image_urls[0] : null,
        categoryName: item.category_name,
        totalMachinery: item.total_machinery,
        createdDate: new Date(item.created_at).toLocaleDateString(),
        lastUpdated: new Date(item.updated_at).toLocaleDateString(),
      }));

      setData(mapped);
      setPagination(res.pagination);
      setNoDataMessage(null);
    } catch (error) {
      console.error(error);
      setData([]);
      setPagination(null);
      setNoDataMessage("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchCategories();
  }, [search, page, perPage, sortBy, sortOrder]);

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);

      const res: any = await adminCategoryService.delete(id);

      if (res?.status) {
        toast.success(res.message || "Category deleted successfully");

        if (data.length === 1 && page > 1) {
          setPage((p) => p - 1);
        } else {
          fetchCategories();
        }
      }
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);
      await handleDelete(deleteId); // 🔥 reuse logic
      setDeleteId(null); // close modal
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= TABLE COLUMNS ================= */
  const columns: Column<CategoryRow>[] = [
    {
      key: "image",
      header: "Image",
      render: (row) =>
        row.image_urls && (
          <div className="relative w-[44px] h-[44px] overflow-hidden rounded-lg">
            <Image
              src={row.image_urls}
              alt={row.categoryName}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
        ),
      className: "w-[90px]",
    },
    {
      key: "categoryName",
      header: "Category Name",
      sortable: true,
      onSort: () => {
        setSortBy("category_name");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    {
      key: "createdDate",
      header: "Created Date",
      render: (r) => (
        <span className="bg-[#ECECEC] px-3 py-1 rounded-md text-sm">
          {r.createdDate}
        </span>
      ),
    },
    {
      key: "lastUpdated",
      header: "Last Updated",
      render: (r) => (
        <span className="bg-[#ECECEC] px-3 py-1 rounded-md text-sm">
          {r.lastUpdated}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-3">
          <TooltipWrapper content="Edit category">
            <button
              disabled={loadingEditId === row.id}
              onClick={() => {
                setLoadingEditId(row.id);
                router.push(`/admin/category/add?id=${row.id}`);
              }}
              className="flex items-center justify-center"
            >
              {loadingEditId === row.id ? (
                <HiArrowPath
                  size={18}
                  className="text-[#EDB423] animate-spin"
                />
              ) : (
                <BiEdit size={18} className="text-[#EDB423] cursor-pointer" />
              )}
            </button>
          </TooltipWrapper>
          <TooltipWrapper content="Delete category">
            <HiOutlineTrash
              className="text-[#DD3623] cursor-pointer"
              size={18}
              onClick={() => setDeleteId(row.id)}
            />
          </TooltipWrapper>
        </div>
      ),
      className: "w-[120px]",
    },
  ];

  return (
    <div className="space-y-5 bg-white border border-border rounded-[14px] p-3 sm:p-5">
      {/* TOP BAR */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative w-[220px]">
          <FiSearch
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-seclightgray"
          />
          <input
            type="text"
            placeholder="Search...."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full py-[12px] pl-[44px] pr-4 text-sm border rounded-lg border-border"
          />
        </div>

        <button
          className="gradient-btn px-5 py-[12px] text-sm text-white rounded-lg cursor-pointer transition-all duration-200 ease-in-out
        hover:brightness-110 hover:shadow-md active:brightness-90 active:scale-95"
          onClick={() => router.push("/admin/category/add")}
        >
          + Add Category
        </button>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {loading && (
            <div className="flex justify-center items-center h-full">
              <Loader />
            </div>
          )}

          {!loading && data.length === 0 && (
            <p className="text-center text-sm text-gray-500">{noDataMessage}</p>
          )}

          {data.map((item) => (
            <CategoryMobileCard
              key={item.id}
              item={item}
                loadingEditId={loadingEditId}
    onEdit={() => {
      setLoadingEditId(item.id);
      router.push(`/admin/category/add?id=${item.id}`);
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
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Yes, Delete"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
