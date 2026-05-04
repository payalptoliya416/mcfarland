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
type DeleteOrderResponse = {
  success: boolean;
  message: string;
};
/* ================= SERVICE ================= */

type AddTrackingResponse = {
  status: boolean;
  message: string;
  data: {
    id: number;
    order_id: number;
    tracking_date: string;
    city: string;
    status: string;
  };
};

export type TrackingItem = {
  id: number;
  order_id: number;
  tracking_date: string;
  city: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type GetTrackingResponse = {
  status: boolean;
  message: string;
  data: TrackingItem[];
};

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
    delete: (id: number) =>
    adminApi<DeleteOrderResponse>("/orders/delete", {
      method: "POST",
      body: JSON.stringify({ order_id: id }),
    }),

  addTracking: (payload: {
    order_id: number;
    tracking_date: string;
    city: string;
    status: string;
  }) =>
    adminApi<AddTrackingResponse>("/orders/tracking/add", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    getTracking: (payload: { order_id: number }) =>
  adminApi<GetTrackingResponse>("/orders/tracking", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  deleteTracking: (payload: { id: number }) =>
  adminApi<{ success: boolean; message: string }>("/orders/tracking/delete", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  updateTracking: (payload: {
  id: number;
  tracking_date: string;
  city: string;
  status: string;
}) =>
  adminApi<{ status: boolean; message: string }>("/orders/tracking/update", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
};

