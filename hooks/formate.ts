// ✅ US Dollar Price Formatter
export const formatPrice = (amount: number | string | null | undefined) => {
  if (amount === null || amount === undefined || amount === "") return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};
