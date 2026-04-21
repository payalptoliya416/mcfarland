import { adminApi } from "@/api/admin/http";
import { ADMIN_SETTINGS_API, BIDDING_API } from "@/api/admin/endpoints";

export interface GetBiddingParams {
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface BiddingApiItem {
  id: number;
  year: string;
  make: string;
  model: string;
  bid_end_time: string;
  bid_start_price: string;
  bid_status: "active" | "pending" | "sold" | "cancelled";
  bids_count: number;
  name: string;
  auction_id: string | number;
}

export interface GetBiddingResponse {
  success: boolean;
  data: BiddingApiItem[];
  message?: string;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

type UpdateBidStatusResponse = {
  success: boolean;
  message: string | {
    machinery_id?: string[];
  };
};

export const adminBiddingService = {
  list: (params: GetBiddingParams) =>
    adminApi<GetBiddingResponse>(BIDDING_API.MACHINERY_BIDDING_INFO, {
      method: "POST",
      body: JSON.stringify(params),
    }),
     deleteBid: (bid_id: string | number) =>
    adminApi("/bidding/delete-bid", {
      method: "POST",
      body: JSON.stringify({ bid_id }),
    }),
    updateBidStatus: (machinery_id: number, bid_status: number) =>
  adminApi<UpdateBidStatusResponse>("/bidding/update-bid-status", {
    method: "POST",
    body: JSON.stringify({
      machinery_id,
      bid_status,
    }),
  }),
};

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export const adminSettingsService = {
  changePassword: (payload: ChangePasswordPayload) =>
    adminApi<ChangePasswordResponse>(
      ADMIN_SETTINGS_API.CHANGE_PASSWORD,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),
};

/* ================= MACHINERY INFO ================= */
export interface MachineryInfo {
  id?: string | number;
  name: string;
  bid_start_price: string;
  highest_bid: string;
  bid_end_time: string;
  bid_status: "active" | "closed";
  status: number;
}

export interface BiddingDetail {
  id?:string;
  user_full_name: string;
  user_email: string;
  user_phone: string;
  bid_amount: string;
  bid_created_at: string;
  is_highest: boolean;
  is_won:boolean;
  status: number;
}

export interface MachineryBiddingData {
  machinery_info: MachineryInfo;
  bidding_details: BiddingDetail[];
}

export interface MachineryBiddingResponse {
  success: boolean;
  data: MachineryBiddingData;
}

/* ================= UI TABLE ROW ================= */
export interface BidRow {
  id: string;
  user_name: string;
  email: string;
  phone: string;
  last_bid: number;
  bidding_date: string;
  isHighlighted: boolean;
}

export const getMachineryBiddingDetails = (machineryId: number) => {
  return adminApi<MachineryBiddingResponse>(
    "/bidding/machinery-bidding-details",
    {
      method: "POST",
      body: JSON.stringify({
        machineryId : machineryId,
      }),
    }
  );
};

export const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
export type RecentBid = {
  machinery_name: string;
  total_bids: number;
  bid_end_time: string;
};

export type RecentWonUser = {
  machinery_name: string;
  won_user_name: string;
  won_bid_price: string;
};

export type RecentUser = {
  full_name: string;
  email: string;
  phone_no: string;
  registration_date: string;
  license_status: "Pending" | "Approved" | "Declined";
  user_status: "Active" | "Inactive";
};

export type RecentOrder = {
  order_id: string;
  user_name: string;
  phone_no: string;
  amount: string;
  order_date: string;
  status:
    | "Pending"
    | "Process"
    | "Shipped"
    | "In Transit"
    | "Delivered"
    | "Cancelled";
};

export type DashboardData = {
  total_users: number;
  total_machinery: number;
  pending_license_users: number;
  recent_bids: RecentBid[];
  recent_won_users: RecentWonUser[];
  recent_users: RecentUser[];
  recent_orders: RecentOrder[];
  
};

export type DashboardadminResponse = {
  success: boolean;
  data: DashboardData;
};

export const adminDashboardService = () => {
  return adminApi<DashboardadminResponse>("/dashboard", {
    method: "GET",
  });
};