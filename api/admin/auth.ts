import { adminApi } from "./http";
import { ADMIN_API } from "./endpoints";

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  status: boolean;
  message: string;
  token: string;
  token_type: string;
  expires_in: number;
  admin: {
    id: number;
    name: string;
    email: string;
  };
}

export const adminAuthService = {
  login: (payload: AdminLoginPayload) =>
    adminApi<AdminLoginResponse>(ADMIN_API.LOGIN, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
