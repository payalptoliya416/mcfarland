export interface LoginPayload {
  email: string;
  password: string;
}

interface Category {
  id: number;
  category_name: string;
  image_url: string;
  total_machinery: number;
}