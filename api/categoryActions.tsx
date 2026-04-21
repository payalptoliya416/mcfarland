import { ContactPayload, dataService, getMakesModels, getSettingsKeyWise } from "./data";

export const getAllCategories = async () => {
  return dataService.getCategories();
};

export const userCheckout = async (payload: any) => {
  return dataService.checkoutUser(payload);
};

export const getMachineryByCategory = async (
  categoryName: string[],
  sortBy: string,
  fromYear?: number,
  toYear?: number,
  make?: string,
  model?: string,
    page: number = 1,          // 👈 ADD
  perPage: number = 15
) => {
  return dataService.getMachineryByCategory(
    categoryName,
    sortBy,
    fromYear,
    toYear,
    make,
    model,
      page,
    perPage
  );
};

export const getSingleInventory = async (payload: {
  category: string;
  make: string;
  model: string;
  auction_id: number | string;
}) => {
  return dataService.getSingleInventory(payload);
};

export const placeBid = async (
   machineryId: number,
  auctionId: string | number,
  amount: number
) => {
  return dataService.placeBid(machineryId, auctionId, amount);
};

export const loginCheck = () => {
  return dataService.loginCheck();
};

export const licenseVerify = () => {
  return dataService.licenseVerify();
};

export const getMakes = () => getMakesModels("make");

export const getModels = () =>
  getMakesModels("model");

export const purchaseMachinery = async (
  machineryId: number
) => {
  return dataService.purchaseMachinery(machineryId);
};

export const getSettingsByKeys = async () => {
  return getSettingsKeyWise();
};

export const getSettingsByKeysFooter = async () => {
  return dataService.getSettingsKeyWiseFooter();
};

export const sendContactEmail = async (payload: ContactPayload) => {
  return dataService.sendContactEmail(payload);
};