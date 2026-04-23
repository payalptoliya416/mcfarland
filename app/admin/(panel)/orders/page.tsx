"use client";

import AdminDataTable, { Column } from "@/components/tables/AdminDataTable";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminOrdersService } from "@/api/admin/orders";
import OrderStatusDropdown from "@/adminpanel/OrderStatusDropdown";
import OrderMobileCard from "@/adminpanel/OrderMobileCard";
import { formatPrice } from "@/hooks/formate";
import { FaFilePdf } from "react-icons/fa6";
import PaymentSlipModal from "@/adminpanel/PaymentSlipModal";
import { TooltipWrapper } from "@/adminpanel/TooltipWrapper";
import { IoReceiptSharp } from "react-icons/io5";
import { HiOutlineTrash } from "react-icons/hi2";
import ConfirmModal from "@/components/tables/ConfirmDialog";
import toast from "react-hot-toast";

/* ================= TYPES ================= */
export type OrderRow = {
  id: number;
  orderId: string;
  machineryId: number;
  machineryName: string;
  userName: string;
  phone: string;
  orderDate: string;
  orderAmount: string;
  typeText: string;
  status:
  | "Order Submitted"
  | "Sales Agreement"
  | "Awaiting Invoice"
  | "Settle Payment"
  | "Payment Confirmed"
  | "Processing"
  | "Shipping Started"
  | "In Transit"
  | "Delivered"
  | "Cancelled";
  invoiceUrl?: string;
  contractUrl?: string;
  paymentSlipUrl?: string;
  paymentSlipStatus: "Pending" | "Approve" | "Decline";
};

export default function AdminOrder() {
  const router = useRouter();

  /* ================= STATE ================= */
  const [data, setData] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [pagination, setPagination] = useState<any>(null);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const [slipModal, setSlipModal] = useState<{
    open: boolean;
    orderId?: number;
    slipUrl?: string;
    paymentSlipStatus?: "Pending" | "Approve" | "Decline";
  }>({ open: false });

    const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  /* ================= FETCH ================= */
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await adminOrdersService.list({
        search,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      if (!res?.data || res.data.length === 0) {
        setData([]);
        setPagination(res.pagination ?? null);
        setNoDataMessage(res.message ?? "No orders found");
        return;
      }
      const mapped: OrderRow[] = res.data.map((item) => ({
        id: item.id,
        orderId: item.order_id,
        machineryId: item.machinery_id,
        machineryName: item.machinery_name,
        userName: item.user_full_name,
        phone: item.phone_no,
        orderDate: item.order_date,
        orderAmount: `${formatPrice(item.order_amount)}`,
        typeText: item.type_text,
        status: item.status,
        invoiceUrl: item.invoice_url,
        contractUrl: item.contract_url || undefined,
        paymentSlipUrl: item.payment_slip_url,
        paymentSlipStatus: item.payment_slip_status_text,
      }));

      setData(mapped);
      setPagination(res.pagination);
      setNoDataMessage(null);
    } catch (e) {
      setData([]);
      setPagination(null);
      setNoDataMessage("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [search, page, perPage, sortBy, sortOrder]);

  /* ================= COLUMNS ================= */
  const columns: Column<OrderRow>[] = [
    {
      key: "orderId",
      header: "Order ID",
      sortable: true,
      onSort: () => {
        setSortBy("order_id");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
      render: (row) => (
        <span className="text-xs whitespace-nowrap">{row.orderId}</span>
      ),
    },
    {
      key: "machineryName",
      header: "Machinery Name",
      sortable: true,
      onSort: () => {
        setSortBy("machinery_name");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
      render: (row) => (
        <span className="text-xs font-medium text-gray-800">
          {row.machineryName}
        </span>
      ),
    },
    {
      key: "userName",
      header: "User Name",
      sortable: true,
      onSort: () => {
        setSortBy("user_full_name");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    {
      key: "phone",
      header: "Phone Number",
      render: (row) => (
        <span className="text-xs whitespace-nowrap">{row.phone}</span>
      ),
    },
    {
      key: "orderDate",
      header: "Order Date",
      render: (r) => (
        <span className="py-1 rounded-md text-xs">{r.orderDate}</span>
      ),
    },

    {
      key: "orderAmount",
      header: "Order Amount",
      sortable: true,
      onSort: () => {
        setSortBy("order_amount");
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
      },
    },
    {
      key: "typeText",
      header: "Order Type",
      render: (row) => (
        <span className="text-xs">
          {row.typeText}
        </span>
      ),
    },
    {
      key: "paymentSlipStatus",
      header: "Payment Receipt Status",
      render: (row) => {
        const config = {
          Pending: {
            dot: "bg-yellow-400",
            text: "text-yellow-700",
            bg: "bg-yellow-50",
            label: "Pending",
          },
          Approve: {
            dot: "bg-green-500",
            text: "text-green-700",
            bg: "bg-green-50",
            label: "Approved",
          },
          Decline: {
            dot: "bg-red-500",
            text: "text-red-700",
            bg: "bg-red-50",
            label: "Declined",
          },
        }[row.paymentSlipStatus];

        return (
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.bg} ${config.text}`}
          >
            <span>{config.label}</span>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <OrderStatusDropdown
          value={row.status}
          orderId={row.id}
           orderType={row.typeText as "Checkout" | "Bidding"}   
            paymentSlipStatus={row.paymentSlipStatus}
           paymentSlipUrl={row.paymentSlipUrl}
          onUpdated={fetchOrders} 
        />
      ),
    },
    {
      key: "invoiceUrl",
      header: "Actions",
      render: (row) => {
        const isDisabled =
          row.paymentSlipStatus === "Pending" && !row.paymentSlipUrl;

        return (
          <div className="flex items-center justify-center gap-4">
            <TooltipWrapper content="Invoice">
              <button
                disabled={!row.invoiceUrl}
                onClick={() => window.open(row.invoiceUrl!, "_blank")}
                className={`${
                  row.invoiceUrl
                    ? "text-green transition cursor-pointer"
                    : "text-green cursor-not-allowed"
                }`}
              >
                <FaFilePdf size={20} />
              </button>
            </TooltipWrapper>
           <TooltipWrapper
            content={
              row.contractUrl && row.contractUrl.trim() !== ""
                ? "View Contract"
                : "Contract Not Available"
            }
          >
            <button
              disabled={!row.contractUrl || row.contractUrl.trim() === ""}
              onClick={() => {
                if (!row.contractUrl || row.contractUrl.trim() === "") return;
                window.open(row.contractUrl, "_blank");
              }}
              className={`transition ${
                row.contractUrl && row.contractUrl.trim() !== ""
                  ? "text-[#EDB423] hover:text-[#EDB423] cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              <FaFilePdf size={20} />
            </button>
          </TooltipWrapper>
            <TooltipWrapper
              content={
                isDisabled
                  ? "Payment Receipt not uploaded yet"
                  : "View payment Receipt"
              }
            >
              <button
                disabled={isDisabled}
                onClick={() =>
                  !isDisabled &&
                  setSlipModal({
                    open: true,
                    orderId: row.id,
                    slipUrl: row.paymentSlipUrl,
                    paymentSlipStatus: row.paymentSlipStatus,
                  })
                }
                className={`
                  ${
                    isDisabled
                      ? "text-orange cursor-not-allowed"
                      : "text-orange cursor-pointer"
                  }`}
              >
                <IoReceiptSharp size={20} />
              </button>
            </TooltipWrapper>

          <TooltipWrapper content="Delete Order">
            <HiOutlineTrash
              className="text-[#DD3623] cursor-pointer"
              size={20}
              onClick={() => setDeleteId(row.id)}
            />
          </TooltipWrapper>
            
          </div>
        );
      },
    },
  ];

const handleDelete = async (id: number) => {
  try {
    const res = await adminOrdersService.delete(id);

    if (res?.status) {
      toast.success(res.message || "Order deleted successfully");

      // ✅ STEP 1: instant UI update
      setData((prev) => prev.filter((item) => item.id !== id));

      // ✅ STEP 2: pagination handle
      if (data.length === 1 && page > 1) {
        setPage((p) => p - 1); // this will trigger useEffect
      }

      // ✅ STEP 3 (optional but recommended): background refetch
      fetchOrders();
    }
  } catch {
    toast.error("Failed to delete order");
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

      {/* MOBILE VIEW */}
      <div className="block xl:hidden space-y-4">
        {data.map((order) => (
          <OrderMobileCard
            key={order.id}
            order={order}
            onUpdated={fetchOrders}
            onView={() => router.push(`/admin/orders/view?id=${order.id}`)}
            onEdit={() => router.push(`/admin/orders/edit?id=${order.id}`)}
            onDelete={() => console.log("delete")}
            onOpenPaymentSlip={(order) =>
              setSlipModal({
                open: true,
                orderId: order.id,
                slipUrl: order.paymentSlipUrl,
                paymentSlipStatus: order.paymentSlipStatus,
              })
            }
          />
        ))}
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden xl:block">
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
      </div>
      <PaymentSlipModal
        open={slipModal.open}
        orderId={slipModal.orderId!}
        slipUrl={slipModal.slipUrl}
        paymentSlipStatus={slipModal.paymentSlipStatus!}
        onClose={() => setSlipModal({ open: false })}
        onUpdated={fetchOrders}
      />

      <ConfirmModal
              open={deleteId !== null}
              title="Delete Order"
              description="Are you sure you want to delete this order? This action cannot be undone."
              confirmText="Yes, Delete"
              loadingText="Deleting..."
              confirmVariant="danger"
              loading={deleteLoading}
              onConfirm={confirmDelete}
              onClose={() => setDeleteId(null)}
            />
    </div>
  );
}
