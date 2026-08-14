export type SmsType =
  | "auction_won"
  | "buy_now"
  | "settle_payment"
  | "shipping_started";

interface SendSMSProps {
  phone: string;
  type: SmsType;
  companyName: string;
  orderType?: "Bidding" | "Checkout";
}

interface PingramResponse {
  sid?: string;
  id?: string;
  message?: string;
  status?: string;
  error_code?: string;
  error_message?: string;
}

export const sendSMS = async ({
  phone,
  type,
  companyName,
  orderType,
}: SendSMSProps): Promise<{
  success: boolean;
  data?: PingramResponse;
}> => {
  try {
    let message = "";

    switch (type) {

      case "auction_won":
        message = `Congrats! You won an auction at ${companyName}. Please sign in to review and complete your sales agreement.`;
        break;

      case "buy_now":
        message = `Thank you for your purchase with ${companyName}! Your Buy It Now item is secured. Sign in to view your invoice and complete payment.`;
        break;

      case "settle_payment":
        if (orderType === "Bidding") {
          message = `Thank you for bidding with ${companyName}. Your winning item has been secured. Please sign in to review your invoice and complete payment.`;
        } else {
          message = `Thank you for your purchase with ${companyName}. Your order has been secured. Please sign in to review your invoice and complete payment.`;
        }
        break;

      case "shipping_started":
        message = `Your shipment from ${companyName} has been started. Your order is now on the way.`;
        break;

      default:
        message = "SMS";
    }
    const PINGRAM_API_URL =
      process.env.PINGRAM_API_URL || "https://api.eu.pingram.io/sms";

    // Pingram request
    const response = await fetch(PINGRAM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer pingram_sk_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJrZXlfOWFlYWViN2QzYjZlMDE1MWZjOTAwMWQ3OTIyMjViMTUiLCJ2ZXJzaW9uIjoxLCJhY2NvdW50SWQiOiI1eDJmZm90eXM5aHBxYmxzaGgxZWk2bnVlNyIsImtleVR5cGUiOiJzZWNyZXQiLCJlbnZpcm9ubWVudElkIjoiNXgyZmZvdHlzOWhwcWJsc2hoMWVpNm51ZTcifQ.emdCQr3WYYXODlaf3knTpmcRxirHPCgYtFEMtajmhq4`,
      },
      body: JSON.stringify({
        type: "sms_compose_preview",
        to: phone,
        message,
      }),
    });

    const data: PingramResponse = await response.json();

    if (response.ok) {
      return {
        success: true,
        data,
      };
    }

    console.error("❌ Pingram SMS failed:", {
      status: response.status,
      data,
    });

    return {
      success: false,
      data,
    };
  } catch (error) {
    console.error("❌ Pingram SMS error:", error);

    return {
      success: false,
    };
  }
};