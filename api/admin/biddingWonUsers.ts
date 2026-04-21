import { adminApi } from "./http";

/* ================= QUERY ================= */

export interface WonUsersQueryPayload {
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

/* ================= API ITEM ================= */

export interface WonUserApiItem {
  machinery_id: number;
  machinery_name: string;
  contract_status:
    | "Pending"
    | "Send"
    | "Signed"
    | "Rejected"
    | "Approved"
    | "Unknown";
  user_full_name: string;
  phone_no: string;
  category: string;
  won_bid_amount: string | null;
  contract_file_url: string | null;
}

/* ================= RESPONSE ================= */

export interface WonUserApiResponse {
  success: boolean;
  data: WonUserApiItem[];
   message: string;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export type WonUserRow = {
  machinery_id: number;
  userName: string;
  machineryName: string;
  phone: string;
  wonBidPrice: string;
  status:
    | "Pending"
    | "Send"
    | "Signed"
    | "Rejected"
    | "Approved"
    | "Unknown";
  contractUrl: string | null;
};

/* ================= SERVICE ================= */

export const adminWonUsersService = {
  list: (payload: WonUsersQueryPayload) =>
    adminApi<WonUserApiResponse>("/bidding/bidding-won-users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export type WonDetailsPayload = {
  machinery_id: number;
};

/* ================= RESPONSE DATA ================= */

export type WonDetailsData = {
  machinery_id: number;
  machinery_name: string;
  contract_status:
    | "Pending"
    | "Send"
    | "Signed"
    | "Rejected"
    | "Approved"
    | "Unknown";
  user_full_name: string;
  phone_no: string;
  category: string;
  won_bid_amount: string | null;
  contract_file_url: string | null;
};

/* ================= RESPONSE ================= */

export type WonDetailsResponse = {
  success: boolean;
  data: WonDetailsData;
};

/* ================= API ================= */

export const adminWonDetailsService = (payload: WonDetailsPayload) => {
  return adminApi<WonDetailsResponse>(
    "/bidding/machinery-wise-won-details",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
};

export type UpdateContractStatusPayload = {
  machinery_id: number;
  action: "approve" | "reject";
  bank_name?: string;
  beneficiary_name?: string;
  beneficiary_address?: string;
  account_number?: string;
  routing_number?: string;
  branch_address?: string;
};

export type UpdateContractStatusResponse = {
  success: boolean;
  message: string;
};

export const adminUpdateContractStatusService = (
  payload: UpdateContractStatusPayload
) => {
  return adminApi<UpdateContractStatusResponse>(
    "/bidding/update-contract-status",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
};