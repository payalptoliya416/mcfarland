
export interface MachineryImage {
  id: number;
  machinery_id: number;
  image_path: string;
  sort_order: number;
  full_url: string;
  type?: string;
}

export interface MachineryCategory {
  id: number;
  image: string;
  category_name: string;
  total_machinery: number;
}
interface SpecificationItem {
  key: string;
  value: number | string;
}
export interface SingleMachinery {
  id: number;
  category_id: number;
  make?: string;
  model?: string;
  name: string;
  year: string;
  weight: string;
  working_hours: string;
  condition: string;
  current_bid: string;
  fuel: string;
  buy_now_price: string;
  bid_start_price: string;
  bid_end_time: string;
  description: string;
  specification?: SpecificationItem[];
  offer: string[] | number;
  status: number;
  images: MachineryImage[];
  category: MachineryCategory;
  serial_number: string;
  auction_id: string | number;
}

export interface SingleMachineryResponse {
  success: boolean;
  data: SingleMachinery;
}
