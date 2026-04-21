import { api } from "../http";

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  address: string;
  company_name: string;
  city: string;
  state: string;
  zip_code: string;
  status: number;
  is_license: number;
  license_status: "Verified" | "Unverified" | string;
  created_at: string;
  updated_at: string;

  country_code?: string;
  country?: string;
}

export interface UserProfileResponse {
  status: boolean;
  message: string;
  data: UserProfile;
}

export interface UserProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  city: string;
  state: string;
  zip: string;
}

export const getUserProfile = (): Promise<UserProfileResponse> =>
  api<UserProfileResponse>("/user/get-profile", {
    method: "GET",
  });

export const updateUserProfile = (
  payload: UserProfileFormValues,
): Promise<{ status: boolean; message: string; data: UserProfile }> =>
  api("/user/profile-update", {
    method: "POST",
    body: JSON.stringify({
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      company_name: payload.company,
      city: payload.city,
      state: payload.state,
      zip_code: payload.zip,
    }),
  });

export interface UserDetails {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  address: string;
  company_name: string;
  city: string;
  state: string;
  zip_code: string;
  status: number;
  is_license: number;
  created_at: string;
  updated_at: string;
}

export interface UserDetailsResponse {
  status: boolean;
  message: string;
  data: UserDetails;
}

export const getUserDetails = (): Promise<UserDetailsResponse> => {
  return api<UserDetailsResponse>("/user/get-details", {
    method: "POST",
  });
};

export interface SaleAgreementRequest {
  machinery_id: number;
  billing_details: {
    legal_company_name: string;
    street_and_number: string;
    city: string;
    state_province?: string;
    zip_postal_code: string;
    country: string;
  };
  shipping_details:
    | {
        is_different: false;
      }
    | {
        is_different: true;
        shipping_street: string;
        shipping_city: string;
        shipping_state?: string;
        shipping_zip: string;
        shipping_country: string;
      };
}

type SaleAgreementResponse =
  | {
      success: true;
      data: string;
    }
  | {
      success: false;
      message: string;
    };

export const getSaleAgreementContract = (
  payload: SaleAgreementRequest,
): Promise<SaleAgreementResponse> => {
  return api<SaleAgreementResponse>("/user/get-contract", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
