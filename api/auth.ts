
import { API } from "./endpoints";
import { api } from "./http";
import type { SignupPayload, VerifyOtpPayload, VerifyOtpResponse } from "@/types/authtype";
import type { LoginResponse } from "@/types/signinType";

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  register: (data: SignupPayload) =>
    api<unknown>(API.REGISTER, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginPayload): Promise<LoginResponse> =>
    api<LoginResponse>(API.LOGIN, {
      method: "POST",
      body: JSON.stringify(data),
    }),

    
  forgotPassword: (data: { email: string }) =>
    api<{ message: string , status : boolean}>(API.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verifyOtp: (data: VerifyOtpPayload): Promise<VerifyOtpResponse> =>
    api<VerifyOtpResponse>(API.VERIFY_OTP, {
      method: "POST",
      body: JSON.stringify(data),
    }),
    resetPassword: (data: {
      email: string;
      password: string;
      password_confirmation: string;
    }) =>
      api<{ message: string }>(API.RESET_PASSWORD, {
        method: "POST",
        body: JSON.stringify(data),
      }),

};
