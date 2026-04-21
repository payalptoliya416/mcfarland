import { adminApi } from "@/api/admin/http";

export interface GetMachineryParams {
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface MachineryApiItem {
  id: number;
  auction_id: number | string;
  make: string;
  model: string;
  year: string;
  working_hours: string;
  buy_now_price: string;
  bid_start_price: string;
  status: number;
  video_urls?: string[];
  image_urls: string[];
  category: {
    id: number;
    category_name: string;
  };
}

export interface GetMachineryResponse {
  status: boolean;
  data: MachineryApiItem[];
  message?: string;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface MachineryStorePayload {
  category_id: number;
  make: string;
  model: string;
  year: string;
  weight: string;
  working_hours: string;
  condition: string;
  fuel: string;
  serial_number: string;
  buy_now_price: number;
  bid_start_price: number;
  bid_end_days: number;
  description: string;
  offer: string;
  image_urls: string[];
  video_urls: string[];
  status: number;
}
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
export interface MachineryResponse {
  id: number;
  category_id: number;
  make: string;
  model: string;
  year: string;
  weight: string;
  working_hours: string;
  condition: string;
  fuel: string;
  serial_number: string;
  buy_now_price: string;
  bid_start_price: string;
  bid_end_time: string;
  description: string;
  offer: string;
  status: number;
  image_urls: string[];
  video_urls: string | string[];
}

export const adminMachineryService = {
  list: (params: GetMachineryParams) =>
    adminApi<GetMachineryResponse>("/machinery", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  show: (id: number) =>
    adminApi<ApiResponse<any>>("/machinery/show", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),

  update: (id: string | null, payload: any) =>
    adminApi<ApiResponse<any>>(`/machinery/update`, {
      method: "POST",
      body: JSON.stringify({
        id,
        ...payload,
      }),
    }),

  store: (payload: MachineryStorePayload) =>
    adminApi<ApiResponse<MachineryResponse>>("/machinery/store", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  delete: (id: number) =>
    adminApi<ApiResponse<any>>("/machinery/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
    
    regenerateAuctionId: (machineryId: number) =>
  adminApi<ApiResponse<any>>("/machinery/regenerate-auction-id", {
    method: "POST",
    body: JSON.stringify({
      machinery_id: machineryId,
    }),
  }),

updateStatus: (data: { id: number; status: number }) =>
  adminApi<ApiResponse<any>>("/machinery/update-status", {
    method: "POST",
    body: JSON.stringify({
      id: data.id,
      status: data.status,
    }),
  }),
};
