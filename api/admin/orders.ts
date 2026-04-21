import { adminApi } from "./http";

/* ================= QUERY PARAMS ================= */

export interface OrderQueryPayload {
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

/* ================= API ITEM ================= */

export interface OrderApiItem {
  id: number;
  order_id: string;
  machinery_id: number;
  user_id: number;
  price: string;
  delivery_status: number;
  purchase_date: string;
  user_full_name: string;
  phone_no: string;
  order_date: string;
  order_amount: string;
  machinery_name: string;
  status: | "Order Submitted"
  | "Sales Agreement"
  | "Awaiting Invoice"
  | "Settle Payment"
  | "Payment Confirmed"
  | "Processing"
  | "Shipping Started"
  | "In Transit"
  | "Delivered"
  | "Cancelled";
  invoice_url?: string;
  contract_url?: string;
  type_text: string;
  payment_slip_status: 0 | 1 | 2;
  payment_slip_status_text: "Pending" | "Approve" | "Decline";
 payment_slip_url?: string;
  status_code: number;
  machinery: {
    id: number;
  };
}

/* ================= RESPONSE ================= */

export interface OrderApiResponse {
  status: boolean;
  message: string;
  data: OrderApiItem[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

/* ================= SERVICE ================= */

export const adminOrdersService = {
  list: (payload: OrderQueryPayload) =>
    adminApi<OrderApiResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
     updateStatus: (payload: { order_id: number; status: number }) =>
    adminApi("/orders/update-status", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    updatePaymentSlipStatus: (payload: { order_id: number; status: 0 | 1 | 2 }) =>
  adminApi("/orders/update-payment-slip-status", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
};

