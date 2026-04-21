"use client";

import AdminDataTable, { Column } from "@/components/tables/AdminDataTable";
import { FiSearch } from "react-icons/fi";
import { HiOutlineEye, HiOutlineTrash } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { adminUserService } from "@/api/admin/usersManagement";
import UserStatusDropdown from "@/adminpanel/UserStatusDropdown";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/tables/ConfirmDialog";
import { useIsMobile } from "@/hooks/useIsMobile";
import UserMobileCard from "@/adminpanel/UserMobileCard";
import { BiEdit } from "react-icons/bi";
import Loader from "@/components/common/Loader";
import { TooltipWrapper } from "@/adminpanel/TooltipWrapper";
import { HiArrowPath } from "react-icons/hi2";
export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}
type UserRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  status_text: string;
  license_status_text: string;
};

export interface UserApiItem {
  id: number;

  first_name: string;
  last_name: string;
  name: string;

  email: string;
  phone_no: string;

  company_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;

  status: number; // 0 | 1 | 2
  is_license: number; // 0 | 1

  // 🔥 FIX HERE
  license_status: "approved" | "declined" | "submit" | null;

  created_at?: string;
  updated_at?: string;
}

export default function UsersPage() {
  const router = useRouter();
  /* ================= STATE ================= */
  const [data, setData] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loadingAction, setLoadingAction] = useState<{
    id: number | null;
    type: "view" | "edit" | null;
  }>({ id: null, type: null });
  const pathname = usePathname();
  useEffect(() => {
    setLoadingAction({ id: null, type: null });
  }, [pathname]);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pagination, setPagination] = useState<any>(null);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  /* ================= FETCH ================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await adminUserService.getUsers({
        search,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      if (!res?.data || res.data.length === 0) {
        setData([]); // ✅ clear old data
        setPagination(res.pagination ?? null);
        setNoDataMessage(res.message ?? "No users found");
        return;
      }

      const rows: UserRow[] = res.data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone_no,
        date: user.created_at
          ? new Date(user.created_at).toLocaleDateString()
          : "-",
        status_text: user.status_text,
        license_status_text: user.license_status_text,
      }));

      setData(rows);
      setPagination(res.pagination);
      setNoDataMessage(null);
    } catch (error) {
      setData([]);
      setPagination(null);
      setNoDataMessage("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page, perPage, sortBy, sortOrder]);

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);
      const res = await adminUserService.delete(deleteId);

      toast.success(res.message || "User deleted successfully");
      fetchUsers();
      setDeleteId(null);
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ================= COLUMNS ================= */
  const columns: Column<UserRow>[] = [
    {
      key: "name",
      header: "User Name",
      sortable: true,
      onSort: () => {
        setSortBy("name");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      onSort: () => {
        setSortBy("email");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    {
      key: "phone",
      header: "Phone Number",
      sortable: true,
      onSort: () => {
        setSortBy("phone");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    {
      key: "date",
      header: "Registration Date",
      sortable: true,
      onSort: () => {
        setSortBy("created_at");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
      render: (r) => (
        <span className="bg-gray-100 px-3 py-1 rounded-md text-xs">
          {r.date}
        </span>
      ),
    },
    {
      key: "license_status_text",
      header: "License Status",
      render: (r) => {
        const status = r.license_status_text ?? "No License";

        const statusConfig: Record<
          string,
          { label: string; className: string }
        > = {
          Approved: {
            label: "Approved",
            className: "bg-green-100 text-green-700",
          },
          Rejected: {
            label: "Rejected",
            className: "bg-red-100 text-red-700",
          },
          Pending: {
            label: "Pending",
            className: "bg-yellow-100 text-yellow-700",
          },
          "No License": {
            label: "No License",
            className: "bg-gray-100 text-gray-600",
          },
        };

        const current = statusConfig[status] ?? statusConfig["No License"];

        return (
          <span
            className={`px-3 py-2 rounded-md text-sm font-medium w-[95px] whitespace-nowrap text-center ${current.className}`}
          >
            {current.label}
          </span>
        );
      },
    },
    {
      key: "status_text",
      header: "User Status",
      render: (r) => (
        <UserStatusDropdown
          value={r.status_text ?? "Pending"}
          userId={r.id}
          onUpdated={fetchUsers} // 🔥 refresh after update
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <div className="flex items-center">
          <TooltipWrapper content="View user">
            <button
              disabled={
                loadingAction.id === r.id && loadingAction.type === "view"
              }
              onClick={() => {
                setLoadingAction({ id: r.id, type: "view" });
                router.push(
                  `/admin/user-management/user-license?id=${r.id}`,
                );
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full text-blue-500 transition cursor-pointer"
            >
              {loadingAction.id === r.id && loadingAction.type === "view" ? (
                <HiArrowPath size={18} className="animate-spin" />
              ) : (
                <HiOutlineEye size={18} />
              )}
            </button>
          </TooltipWrapper>

          <TooltipWrapper content="Edit user">
            <button
              disabled={
                loadingAction.id === r.id && loadingAction.type === "edit"
              }
              onClick={() => {
                setLoadingAction({ id: r.id, type: "edit" });
                router.push(`/admin/user-management/add?id=${r.id}`);
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full text-yellow-500 transition cursor-pointer"
            >
              {loadingAction.id === r.id && loadingAction.type === "edit" ? (
                <HiArrowPath size={18} className="animate-spin" />
              ) : (
                <BiEdit size={18} />
              )}
            </button>
          </TooltipWrapper>

          <TooltipWrapper content="Delete user">
            <button
              onClick={() => setDeleteId(r.id)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-red-500 transition cursor-pointer"
            >
              <HiOutlineTrash size={18} />
            </button>
          </TooltipWrapper>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 bg-white border border-border rounded-[14px] p-3 sm:p-5">
      {/* TOP BAR */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative w-[220px]">
          <FiSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search..."
            className="w-full py-3 pl-10 pr-4 border border-border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* TABLE */}
      {isMobile ? (
        <div className="space-y-4">
          {loading && (
            <div className="flex justify-center items-center h-full">
              <Loader />
            </div>
          )}

          {!loading && data.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              {noDataMessage || "No users found"}
            </div>
          )}

          {!loading &&
            data.map((user) => (
              <UserMobileCard
                key={user.id}
                user={user}
                  loadingAction={loadingAction}
                onEdit={() => {
                  setLoadingAction({ id: user.id, type: "edit" });
                  router.push(`/admin/user-management/add?id=${user.id}`);
                }}
                onView={() => {
                  setLoadingAction({ id: user.id, type: "view" });
                  router.push(
                    `/admin/user-management/user-license?id=${user.id}`,
                  );
                }}
                onDelete={() => setDeleteId(user.id)}
                onUpdated={fetchUsers}
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
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Yes, Delete"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
