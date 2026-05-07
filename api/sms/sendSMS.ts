export type SmsType =
  | "registration"
  | "auction_won"
  | "buy_now"
  | "settle_payment"
  | "shipping_started";

interface SendSMSProps {
  phone: string;
  type: SmsType;
  companyName: string;
}

interface TwilioResponse {
  sid?: string;
  message?: string;
  status?: string;
  error_code?: string;
  error_message?: string;
}

export const sendSMS = async ({
  phone,
  type,
  companyName,
}: SendSMSProps): Promise<{
  success: boolean;
  data?: TwilioResponse;
}> => {
  try {
    let message = "";

    switch (type) {
      case "registration":
        message = `Welcome to ${companyName}! Your registration is complete. Start browsing, bidding, or use Buy It Now.`;
        break;

      case "auction_won":
        message = `Congrats! You won an auction at ${companyName}. Please sign in to review and complete your sales agreement.`;
        break;

      case "buy_now":
        message = `Thank you for your purchase with ${companyName}! Your Buy It Now item is secured. Sign in to view your invoice and complete payment.`;
        break;

      case "settle_payment":
        message = `Thank you for your purchase with ${companyName}! Your Won item is secured. Sign in to view your invoice and complete payment.`;
        break;

      case "shipping_started":
        message = `Your shipment from ${companyName} has been started. Your order is now on the way.`;
        break;

      default:
        message = "SMS";
    }

    // ENV
    const ACCOUNT_SID = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;

    const API_KEY = process.env.NEXT_PUBLIC_TWILIO_API_KEY;

    const API_SECRET = process.env.NEXT_PUBLIC_TWILIO_API_SECRET;

    const FROM_NUMBER = process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER;

    // VALIDATION
    if (!ACCOUNT_SID || !API_KEY || !API_SECRET || !FROM_NUMBER) {
      console.log("Twilio environment variables missing");

      return {
        success: false,
      };
    }

    // AUTH
    const auth = btoa(`${API_KEY}:${API_SECRET}`);

    // FORM DATA
    const formData = new URLSearchParams();

    formData.append("To", phone);
    formData.append("From", FROM_NUMBER);
    formData.append("Body", message);

    // REQUEST
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      },
    );

    const data: TwilioResponse = await response.json();

    console.log("TWILIO SMS RESPONSE:", data);

    if (response.ok) {
      console.log("SMS SENT SUCCESSFULLY");

      return {
        success: true,
        data,
      };
    }

    console.log("SMS FAILED:", data.message || data.error_message);

    return {
      success: false,
      data,
    };
  } catch (error) {
    console.log("SMS ERROR:", error);

    return {
      success: false,
    };
  }
};
