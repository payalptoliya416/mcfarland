import { adminApi } from "./http";
import { ApiResponse } from "./machinery";

/* ================= API ITEM ================= */
export interface UserApiItem {
  id: number;

  first_name: string;
  last_name: string;
  name: string;

  email: string;
  phone_no: string;

  address?: string;
  company_name?: string;
  city?: string;
  state?: string;
  zip_code?: string;

  status: number; // 1 | 0
  is_license: number; // backend ma 2 aave chhe etle number rakho

  license_status?: number | null;
  status_text: string;
  
  license_status_text: string;
  license?: {
    id: number;
    user_id: number;
    file: string;
    status: number;
    file_url: string;
    is_sumsub?: number; 
  };

  created_at?: string;
  updated_at?: string;
}

/* ================= API RESPONSE ================= */

export interface UserApiResponse {
  status: boolean;
  message: string;
  data: UserApiItem[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

/* ================= QUERY PAYLOAD ================= */

export interface UserQueryPayload {
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

/* ================= SERVICE ================= */

export const adminUserService = {
  /** LIST USERS (with pagination + sorting + search) */
  getUsers: (payload: UserQueryPayload) =>
    adminApi<UserApiResponse>("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /** SHOW USER */
  show: (id: number) =>
    adminApi<ApiResponse<UserApiItem>>("/users/show", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),

  /** UPDATE USER STATUS */
  updateStatus: (id: number, user_status: "active" | "blocked") =>
    adminApi<ApiResponse<any>>("/users/update-status", {
      method: "POST",
      body: JSON.stringify({ id, user_status }),
    }),

  /** UPDATE LICENSE STATUS */
  updateLicenseStatus: (id: number, license_status: 0 | 1 | null) =>
    adminApi<ApiResponse<any>>("/users/update-license-status", {
      method: "POST",
      body: JSON.stringify({ id, license_status }),
    }),

  /** DELETE USER */
  delete: (id: number) =>
    adminApi<ApiResponse<any>>("/users/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),

  updateLicenseAction: (id: number, action: "approve" | "decline") =>
    adminApi<ApiResponse<any>>("/users/license/manage", {
      method: "POST",
      body: JSON.stringify({ id, action }),
    }),

  update: (id: number, payload: any) =>
    adminApi("/users/update", {
      method: "POST",
      body: JSON.stringify({ id, ...payload }),
    }),

  changeStatus: (id: number, status: 0 | 1 | 2) =>
    adminApi("/users/change-status", {
      method: "POST",
      body: JSON.stringify({ id, status }),
    }),
};
