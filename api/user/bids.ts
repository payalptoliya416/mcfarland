import { api } from "@/api/http";

export interface BidApi {
  id: number;
  name: string;
  first_image: string | null;
  bid_start_price: string;
  last_bid: string;
  bid_end_time: string;
  status: "Active" | "Expired" | "sold";
}

interface BidResponse {
  success: boolean;
  data: BidApi[];
}

export const bidService = {
  getMyBids: (): Promise<BidResponse> =>
    api<BidResponse>("/user/my-bids", {
      method: "POST",
    }),
};


/* ================= TYPES ================= */

export interface MachineryDetails {
  machinery_name: string;
  bid_end_time: string;
  start_bid_price: string;
  my_bid: string | null;
  user_full_name: string;
  status: "Active" | "Expired" | "sold";
  first_image: string;
}

export interface BiddingDetail {
  user_full_name: string;
  amount: string;
  bid_date_time: string;
  my_bid: boolean;
}

export interface MachineryBidDetailsResponse {
  success: boolean;
  machinery_details: MachineryDetails;
  bidding_details: BiddingDetail[];
}

/* ================= API ================= */

export const bidDetailsService = {
  getMachineryBidDetails: (machineryId: number) =>
    api<MachineryBidDetailsResponse>(
      "/user/machinery-bidding-details",
      {
        method: "POST",
        body: JSON.stringify({ machineryId }),
      }
    ),
};
export interface WonBidRow {
  id: string;
  image: string;
  machinery: string;
  category: string;
  wonBidAmount: string;
  wonDate: string;
  contractStatus:
    | "Pending"
    | "Approved"
    | "Signed"
    | "Rejected"
    | "Unknown";
}

export interface WonBidApiItem {
  id: number;
  first_image: string | null;
  machinery_name: string;
  category: string;
  won_bid_amount: string | null;
  won_date: string;
  contract_status: "Pending" | "Completed" | "Unknown";
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface WonBidResponse {
  success: boolean;
  data: WonBidApiItem[];
  pagination: Pagination;
}

export const wonBidService = {
  getWonBids: (page = 1) =>
    api<WonBidResponse>("/user/won-bids", {
      method: "POST",
      body: JSON.stringify({ page }),
    }),
};

export type DeliveryStatus =
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

export type DeliveryTimelineItem = {
  status: DeliveryStatus;
  date: string;
  status_code: number; 
};
export interface OrderApiItem {
  id: number;
  auction_id: string;
  order_id: string;
  name: string;
  first_image: string | null;
  price: string;
  purchase_date: string;
  serial_no: string;
  working_hours: string;
  weight: string;
  year: string;
  invoice_url?: string;
  contract_url?: string;
  current_status: | "Order Submitted"
  | "Sales Agreement"
  | "Awaiting Invoice"
  | "Settle Payment"
  | "Payment Confirmed"
  | "Processing"
  | "Shipping Started"
  | "In Transit"
  | "Delivered"
  | "Cancelled";
  delivery_status: number;
  type_text : string;
  delivery_status_text: string;
  delivery_contact: string | null;
  delivery_timeline: DeliveryTimelineItem[];
    payment_slip_url?: string | null;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}
export interface OrderQueryPayload {
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface OrderResponse {
  success: boolean;
  data: OrderApiItem[];
  pagination: Pagination;
}

export const orderService = {
  getOrders: (payload: OrderQueryPayload = {}) =>
    api<OrderResponse>("/user/orders", {
      method: "POST",
      body: JSON.stringify({
        page: payload.page ?? 1,
        per_page: payload.per_page ?? 10,
        search: payload.search ?? "",
        sort_by: payload.sort_by ?? "created_at",
        sort_order: payload.sort_order ?? "desc",
      }),
    }),

  uploadPaymentSlip: (payload: {
    order_id: number | string;
    payment_slip: string;
  }) =>
    api<{
      success: boolean;
      message: string;
    }>("/user/upload-payment-slip", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export type WonBid = {
  id: number
  name: string
  category: string
  start_bid_price: string
  won_bid_amount: string | null
  status: string
  contract_html: string
}

export type SingleWonBidResponse = {
  success: boolean
  data: WonBid
}

export const getSingleWonBid = (machineryId: number) => {
   return api<SingleWonBidResponse>("/user/single-won-bids", {
    method: "POST",
    body: JSON.stringify({ machineryId }),
  });
};


export type SignContractResponse = {
  success: boolean;
  message: string;
};

export const signContract = (formData: FormData) => {
  return api<SignContractResponse>("/user/sign-contract", {
    method: "POST",
    body: formData,
  });
};


