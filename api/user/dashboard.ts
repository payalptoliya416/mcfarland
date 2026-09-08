import { api } from "../http";

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone_no: string;
}

/* RECENT BID (API) */
export interface RecentBid {
  machinery_name: string;
  bid_amount: string;
  bid_end_time: string;
}

/* RECENT BUY ORDER (API) */
export interface RecentBuyOrder {
  id?: number;
  order_id?: string | number;
  machinery_name: string;
  price: string;
  purchase_date: string;
  status: "Processing" | "Delivered" | "Cancelled" | string;
  invoice_url?: string;
  contract_url?: string;
  is_contract_viewed?: boolean;
  is_invoice_viewed?: boolean;
}
export interface RecentBuyOrderData {
  id?: number;
  order_id?: string | number;
  machinery_name: string;
  amount: string;
  purchase_date: string;
  status: "Processing" | "Delivered" | "Cancelled" | string;
  invoice_url?: string;
  contract_url?: string;
  is_contract_viewed?: boolean;
  is_invoice_viewed?: boolean;
}

export interface MachineryDetails {
  id: number;
  order_id?: number | string;
  name: string;
  pdf_url?: string;
  contract_url?: string;
  order_status?: number;
  is_contract_viewed?: boolean;
  is_invoice_viewed?: boolean;
}

export interface DashboardData {
  user_info: UserInfo;
  total_bids_placed: number;
  active_bids: number;
  items_won: number;
  items_purchased: number;
  recent_bids: RecentBid[];
  recent_buy_orders: RecentBuyOrderData[];
  is_won?: number;
  is_checkout?: boolean;
  machinery_details?: MachineryDetails;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

export interface DashboardCard {
  id: number;
  icon: string;
  bg: string;
  count: number;
  label: string;
  link: string;
}

export const getUserDashboard = (): Promise<DashboardResponse> => {
  return api<DashboardResponse>("/user/dashboard", {
    method: "GET",
  });
};