import { api } from "./http";


export type CalculateDistancePayload = {
  zip_code: string;
  country: string;
};

export type CalculateDistanceResponse = {
  status: "success";
  company_address: string;
  customer_zip: string;
  country: string;
  distance_miles: number;
  per_mile_delivery_cost: string;
  total_cost: number;
  message?:  string;
};

export const calculateDistanceApi = async (
  payload: CalculateDistancePayload
): Promise<CalculateDistanceResponse> => {
  return api<CalculateDistanceResponse>("/calculate-distance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};
