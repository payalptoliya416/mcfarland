

export interface SignupPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  address: string;
  company_name: string;
  city: string;
  state: string;
  zip_code: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  status: boolean;
  message: string;
}
