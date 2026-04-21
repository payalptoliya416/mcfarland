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
  machinery_name: string;
  price: string;
  purchase_date: string;
  status: "Processing" | "Delivered" | "Cancelled";
   invoice_url?: string; 
}
export interface RecentBuyOrderData {
  machinery_name: string;
  amount: string;
  purchase_date: string;
  status: "Processing" | "Delivered" | "Cancelled";
   invoice_url?: string;
}

export interface DashboardData {
  user_info: UserInfo;
  total_bids_placed: number;
  active_bids: number;
  items_won: number;
  items_purchased: number;
  recent_bids: RecentBid[];
  recent_buy_orders: RecentBuyOrderData[];
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