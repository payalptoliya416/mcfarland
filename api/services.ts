import { authService } from "@/api/auth";
import { SignupPayload, VerifyOtpPayload, VerifyOtpResponse } from "@/types/authtype";
import { LoginResponse } from "@/types/signinType";
import { LoginPayload } from "@/types/siteType";

export const loginUser = (values: LoginPayload): Promise<LoginResponse> => {
  return authService.login(values);
};

export const registerUser = (values: any): Promise<any> => {
  const payload: SignupPayload = {
    first_name: values.first_name,
    last_name: values.last_name,
    email: values.email,
    phone_no: values.phone_no,
    address: values.address,
    company_name: values.company_name,
    city: values.city,
    state: values.state,
    zip_code: values.zip_code,
    password: values.password,
    password_confirmation: values.password_confirmation,
  };

  return authService.register(payload);
};

export const forgotPassword = async (values: { email: string }) => {
  return authService.forgotPassword(values);
};

export const verifyOtp = async (
  values: VerifyOtpPayload
): Promise<VerifyOtpResponse> => {
  return authService.verifyOtp(values);
};

export const resetPassword = async (payload: any) => {
  return authService.resetPassword(payload);
};
