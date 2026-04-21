"use client";

import { useState } from "react";
import { TooltipWrapper } from "./TooltipWrapper";
import { HiOutlineTrash } from "react-icons/hi2";
import AdminDataTable from "@/components/tables/AdminDataTable";
import ConfirmModal from "@/components/tables/ConfirmDialog";
import toast from "react-hot-toast";
import { adminBiddingService } from "@/api/admin/bidding";

/* ================= TYPES ================= */
export interface MyBidRow {
  id: string;
  user_name: string;
  email: string;
  phone: string;
  last_bid: number;
  bidding_date: string;
  isHighlighted?: boolean;
  isWon?: boolean;
}

interface MyBidDataTableProps {
  data: MyBidRow[];
  loading?: boolean;
  hideAction?: boolean;
    onRefresh?: () => void;  
}

/* ================= COMPONENT ================= */
export default function MyBidDataTable({
  data,
  loading = false,
  hideAction,
  onRefresh
}: MyBidDataTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ================= COLUMNS ================= */
  const columns = [
    {
      key: "user_name",
      header: "User",
      render: (row: MyBidRow) => (
        <div className="flex items-center gap-2">
          {row.isWon ? (
            <span className="w-2 h-2 rounded-full bg-[#34C759]" />
          ) : row.isHighlighted ? (
            <span className="w-2 h-2 rounded-full bg-[#3C97FF]" />
          ) : null}

          <span className="font-medium">{row.user_name}</span>

          {row.isWon && (
            <span className="px-2 py-1 text-white bg-green-500 rounded text-xs">
              Won
            </span>
          )}
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "phone",
      header: "Phone",
    },
    {
      key: "bidding_date",
      header: "Bid Time",
      render: (row: MyBidRow) => (
        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
          {row.bidding_date}
        </span>
      ),
    },
    {
      key: "last_bid",
      header: "Bid",
      render: (row: MyBidRow) => (
        <span className="font-semibold">${row.last_bid.toLocaleString()}</span>
      ),
    },
    !hideAction && {
      key: "action",
      header: "Action",
      render: (row: MyBidRow) => (
        <TooltipWrapper content="Delete Bidding">
          <HiOutlineTrash
            className="text-[#DD3623] cursor-pointer"
            size={18}
            onClick={() => setDeleteId(row.id)}
          />
        </TooltipWrapper>
      ),
    },
  ].filter(Boolean) as any;

  /* ================= PAGINATION MOCK ================= */
  const pagination = {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: data.length,
    from: 1,
    to: data.length,
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(true);
      await adminBiddingService.deleteBid(id);

      toast.success("Bid deleted successfully");
      onRefresh?.();
    } catch (error) {
      toast.error("Failed to delete bid");
    } finally {
      setDeleteLoading(false);
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

  return (
    <div className="my-5">
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => {
          console.log("page:", page);
        }}
        onPageSizeChange={(size) => {
          console.log("size:", size);
        }}
        rowClassName={(row, idx) => {
          if (row.isWon) return "bg-[#E6F9EF] hover:bg-green-50";
          if (row.isHighlighted) return "bg-[#FFF7E3] hover:bg-yellow-50";
          return idx % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]";
        }}
      />
      <ConfirmModal
        open={deleteId !== null}
        title="Delete Bid"
        description="Are you sure you want to delete this bid?"
        confirmText="Yes, Delete"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
