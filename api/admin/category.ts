import { adminApi } from "./http";
import { ApiResponse } from "./machinery";

export interface CategoryApiItem {
  id: number;
  image_urls: string[];
  category_name: string;
  total_machinery: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryApiResponse {
  status: boolean;
  message: string;
  data: CategoryApiItem[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface CategoryQueryPayload {
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const adminCategoryService = {
  getCategories: (payload: CategoryQueryPayload) =>
    adminApi<CategoryApiResponse>("/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getAllCategories: () =>
    adminApi<CategoryApiResponse>("/categories", {
      method: "POST",
      body: JSON.stringify({}),
    }),

  show: (id: number) =>
    adminApi<ApiResponse<any>>("/categories/show", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),

  update: (id: number, payload: any) =>
    adminApi<ApiResponse<any>>("/categories/update", {
      method: "POST",
      body: JSON.stringify({ id, ...payload }),
    }),

    delete: (id: number) =>
    adminApi("/categories/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),

};

export const adminCategoryServiceadd = {
  store: (payload: {
    category_name: string;
    total_machinery: number;
    image_urls: string[];
  }) =>
    adminApi("/categories/store", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
