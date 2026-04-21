import { adminApi } from "./http";

/* ================= TYPES ================= */

export type AdminSettingsData = {
  company_name: string;
  email: string;
  phone_no: string;
  address: string;
  per_mile_delivery_cost: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  white_logo: string;
  dark_logo: string;
   bank_name: string;
  beneficiary_name: string;
  beneficiary_address: string;
  account_number: string;
  routing_number: string;
  branch_address: string;
};

export type AdminSettingsResponse = {
  success: boolean;
  data: AdminSettingsData;
};

export type AdminSettingsUpdateResponse = {
  success: boolean;
  message: string;
  data: AdminSettingsData;
};

/* ================= API ================= */

export const adminSettingsService = () => {
  return adminApi<AdminSettingsResponse>("/settings", {
    method: "GET",
  });
};

export const adminSettingsUpdateService = (formData: FormData) => {
  return adminApi<AdminSettingsUpdateResponse>("/settings/update", {
    method: "POST",
    body: formData,
  });
};
