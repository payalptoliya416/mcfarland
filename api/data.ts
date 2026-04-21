import { api } from "./http";
import { API } from "./endpoints";
import { SingleMachineryResponse } from "@/types/apiType";

export interface Category {
  id: number;
  category_name: string;
  image: string;
  image_url: string;
  total_machinery: number;
  machinery_count: number;
}

interface CategoryResponse {
  success: boolean;
  data: Category[];
}

export interface Machinery {
  id: number;
  name: string;
  working_hours: string;
  buy_now_price: string;
  bid_start_price: string;
  category_id: number;
  first_image_url: string;

  category: {
    category_name: string;
  };

  make: string;
  model: string;
}

interface MachineryResponse {
  success: boolean;
  data: Machinery[];
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
  };
}
export interface LoginCheckResponse {
  success: boolean;
  is_logged_in: boolean;
  status?: string;
  message?: string;
}

export interface LicenseVerifyResponse {
  success: boolean;
  is_verify: boolean;
  is_upload: boolean;
  is_reject: boolean;
}

export interface SettingsData {
  company_name: string;
  email: string;
  phone_no: string;
  address: string;
  per_mile_delivery_cost: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  logo: string;
  white_logo: string;
}

export interface SettingsResponse {
  success: boolean;
  data: SettingsData;
}
export interface ContactPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export const dataService = {
  sendContactEmail: (
    payload: ContactPayload
  ): Promise<ContactResponse> =>
    api<ContactResponse>("/contact-email-send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),

  getSettingsKeyWiseFooter: (): Promise<SettingsResponse> =>
    api<SettingsResponse>("/settings/key-wise", {
      method: "POST",
    }),

  getCategories: (): Promise<CategoryResponse> =>
    api<CategoryResponse>(API.ALL_CATEGORY, {
      method: "GET",
    }),

  getMachineryByCategory: (
    categoryName: string[],
    sortBy: string,
    fromYear?: number,
    toYear?: number,
    make?: string,
    model?: string,
    page: number = 1,       // 👈 ADD
    perPage: number = 15
  ): Promise<MachineryResponse> =>
    api<MachineryResponse>(API.MACHINERY_BY_CATEGORY, {
      method: "POST",
      body: JSON.stringify({
        categoryName,
        sort_by: sortBy,
        from_year: fromYear,
        to_year: toYear,
        page,                // 👈 SEND TO BACKEND
        per_page: perPage,
        ...(make && make !== "Any Make" ? { make } : {}),
        ...(model && model !== "Select Model" ? { model } : {}),
      }),
    }),

  getSingleInventory: (payload: {
    category: string;
    make: string;
    model: string;
    auction_id: number | string;
  }): Promise<SingleMachineryResponse> =>
    api<SingleMachineryResponse>(API.SINGLE_INVENTORY_MACHINERY, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  placeBid: (
    machineryId: number,
    auctionId: string | number,
    amount: number
  ): Promise<{ success: boolean, message: string }> =>
    api<{ success: boolean, message: string }>(API.BID_PLACEMENT, {
      method: "POST",
      body: JSON.stringify({
        machinery_id: machineryId,
        auction_id: auctionId,
        amount,
      }),
    }),

  loginCheck: (): Promise<LoginCheckResponse> =>
    api<LoginCheckResponse>(API.USER_SETTINGS, {
      method: "POST",
      body: JSON.stringify({ action: "login-check" }),
    }),

  // ✅ LICENSE VERIFY
  licenseVerify: (): Promise<LicenseVerifyResponse> =>
    api<LicenseVerifyResponse>(API.USER_SETTINGS, {
      method: "POST",
      body: JSON.stringify({ action: "license-verify" }),
    }),

  purchaseMachinery: (
    machineryId: number
  ): Promise<{ success: boolean; message: string }> =>
    api<{ success: boolean; message: string }>(
      API.MACHINERY_PURCHASE,
      {
        method: "POST",
        body: JSON.stringify({
          machineryId,
        }),
      }
    ),


  checkoutUser: (
    payload: any
  ): Promise<{ success: boolean; message: string; data: any }> =>
    api<{ success: boolean; message: string; data: any }>(
      "/user/checkout",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

};

export const getMakesModels = (type: "make" | "model", make?: string) => {
  return api<{ success: boolean; data: string[] }>(API.MAKES_MODELS, {
    method: "POST",
    body: JSON.stringify({
      type,
      ...(make ? { make } : {}),
    }),
  });
};

export const getSettingsKeyWise = (): Promise<{
  success: boolean;
  data: {
    address: string;
    per_mile_delivery_cost: string;
  };
}> =>
  api<{
    success: boolean;
    data: {
      address: string;
      per_mile_delivery_cost: string;
    };
  }>("/settings/key-wise", {
    method: "POST",
  });