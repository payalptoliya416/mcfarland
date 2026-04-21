
export interface UserType {
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
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  token: string;
  token_type: string;
  expires_in: number;
  user: UserType;
}
