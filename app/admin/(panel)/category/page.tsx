"use client";

import AdminDataTable, { Column } from "@/components/tables/AdminDataTable";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const parsePageParam = (value: string | null) => {
    const pageNumber = Number(value);
    return Number.isInteger(pageNumber) && pageNumber >= 1 ? pageNumber : 1;
  };

  const parsePerPageParam = (value: string | null) => {
    const perPageNumber = Number(value);
    return [10, 20, 25, 50, 100].includes(perPageNumber)
      ? perPageNumber
      : 10;
  };

  const defaultSearch = searchParams.get("search") ?? "";
  const defaultPage = parsePageParam(searchParams.get("page"));
  const defaultPerPage = parsePerPageParam(searchParams.get("perPage"));
  const defaultSortBy = searchParams.get("sortBy") ?? "id";
  const defaultSortOrder =
    searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  /* ================= STATE ================= */
  const [data, setData] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [search, setSearch] = useState(defaultSearch);
  const [page, setPage] = useState(defaultPage);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const isMobile = useIsMobile();
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    defaultSortOrder
  );
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const [loadingEditId, setLoadingEditId] = useState<number | null>(null);

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
  const buildQueryString = () => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }
    if (page > 1) {
      params.set("page", String(page));
    }
    if (perPage !== 10) {
      params.set("perPage", String(perPage));
    }
    if (sortBy !== "id") {
      params.set("sortBy", sortBy);
    }
    if (sortOrder !== "desc") {
      params.set("sortOrder", sortOrder);
    }

    return params.toString();
  };

  useEffect(() => {
    const query = buildQueryString();
    const currentQuery = searchParams.toString();
    if (query !== currentQuery) {
      const url = query ? `${pathname}?${query}` : pathname;
      router.replace(url);
    }
  }, [search, page, perPage, sortBy, sortOrder, pathname, searchParams, router]);

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
      await handleDelete(deleteId);
      setDeleteId(null);
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
                const query = buildQueryString();
                router.push(
                  `/admin/category/add?id=${row.id}${query ? `&${query}` : ""}`
                );
              }}
              className="flex items-center justify-center"
            >
              {loadingEditId === row.id ? (
                <HiArrowPath
                  size={18}
                  className="text-[#ff8a45] animate-spin"
                />
              ) : (
                <BiEdit size={18} className="text-[#ff8a45] cursor-pointer" />
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
            className="w-full py-[10px] pl-[44px] pr-4 text-sm border rounded-[50px] border-border"
          />
        </div>

        <button
          disabled={redirecting}
          onClick={() => {
            setRedirecting(true);
            const query = buildQueryString();
            router.push(`/admin/category/add${query ? `?${query}` : ""}`);
          }}
          className={`gradient-btn flex h-10 items-center justify-center gap-2 rounded-[62px]
  border border-primary px-4 xl:px-[25px]
  text-sm xl:text-base font-semibold text-white
  transition-all duration-300 ease-out
  ${
    redirecting
      ? "opacity-70 cursor-not-allowed"
      : "cursor-pointer hover:-translate-y-1 hover:bg-orange-500 hover:border-orange-500 hover:shadow-[0_12px_30px_rgba(242,103,28,0.35)] active:translate-y-[2px] active:scale-[0.97]"
  }`}
        >
          {redirecting && (
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          )}

          {redirecting ? "Add Category" : "+ Add Category"}
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
                const query = buildQueryString();
                router.push(
                  `/admin/category/add?id=${item.id}${query ? `&${query}` : ""}`
                );
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
