"use client";

import { isAuthError } from "@/api/authToken";
import {
  licenseVerify,
  loginCheck,
  placeBid,
} from "@/api/categoryActions";
import { formatPrice } from "@/hooks/formate";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface BidInputProps {
  currentBid: number;
  machineryId: number;
  buyNow: number;

  categoryName: string;
  make: string;
  model: string;
   auction_id: string | number;

  onBidSuccess: () => void;
}
const MESSAGES = {
  BID_TOO_LOW: (min: number) => `Your bid must be higher than $${min}.`,
  BID_SUCCESS: "Your bid has been placed successfully.",
  BID_FAILED: "We couldn’t place your bid. Please try again.",

  LOGIN_REQUIRED: "Please sign in to continue.",
  LICENSE_REQUIRED: "Please verify your account before bidding.",
  LICENSE_REJECTED:
    "Your verification was rejected. Please upload valid documents.",
  LICENSE_PENDING:
    "Your account verification is still under review. Please try again later.",

  PURCHASE_SUCCESS: "Your purchase was successful!",
  PURCHASE_FAILED: "We couldn’t complete your purchase. Please try again.",
};

export default function BidInput({
  currentBid,
  machineryId,
  onBidSuccess,
  buyNow,
    categoryName,
  make,
  model,
  auction_id,
}: BidInputProps) {
  const [bid, setBid] = useState<string>("");
  const [error, setError] = useState("");
  const [bidLoading, setBidLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [isLicenseStatusLoading, setIsLicenseStatusLoading] = useState(true);
  const [licenseStatus, setLicenseStatus] = useState<{
    is_upload?: boolean;
    is_verify?: boolean;
    is_reject?: boolean;
  }>({});
  const router = useRouter();

  const handleChange = (value: string) => {
    // allow empty while backspace
    if (value === "") {
      setBid("");
      setError("");
      return;
    }

    // allow only digits
    if (!/^\d+$/.test(value)) return;

    const num = Number(value);

    if (num <= currentBid) {
      setError(MESSAGES.BID_TOO_LOW(currentBid));
    } else {
      setError("");
    }

    // normalize (0200 → 200)
    setBid(String(num));
  };

  const handlePlus = () => {
    const current = bid === "" ? currentBid : Number(bid);
    setBid(String(current + 100));
    setError("");
  };

  const bidNumber = bid ? Number(bid) : currentBid;

const pathname = usePathname();
const searchParams = useSearchParams();

const query = searchParams.toString();
const returnUrl = query ? `${pathname}?${query}` : pathname;

const loadLicenseStatus = async () => {
    try {
      const licenseRes = await licenseVerify();
      setLicenseStatus({
        is_upload: licenseRes.is_upload,
        is_verify: licenseRes.is_verify,
        is_reject: licenseRes.is_reject,
      });
    } catch (err) {
      // Keep as default; render block state
      setLicenseStatus({});
    } finally {
      setIsLicenseStatusLoading(false);
    }
  };

  const checkLoginAndLicense = async (): Promise<boolean> => {
    let loginRes;

    try {
      loginRes = await loginCheck();
    } catch (err) {
      toast.error(MESSAGES.LOGIN_REQUIRED);
      router.push(`/user/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
      return false;
    }

    if (
      !loginRes ||
      loginRes.status === "error" ||
      !loginRes.success ||
      !loginRes.is_logged_in
    ) {
      toast.error(MESSAGES.LOGIN_REQUIRED);
      router.push(`/user/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
      return false;
    }

    const licenseRes = await licenseVerify();

    if (!licenseRes.is_upload) {
      toast.error(MESSAGES.LICENSE_REQUIRED);
      router.push(
        `/verify-account?returnUrl=${encodeURIComponent(
          returnUrl
        )}`
      );
      return false;
    }

    if (licenseRes.is_reject) {
      toast.error(MESSAGES.LICENSE_REJECTED);
      setTimeout(() => {
        router.push(
          `/verify-account?returnUrl=${encodeURIComponent(
            returnUrl
          )}`
        );
      }, 2000);
      return false;
    }

    if (!licenseRes.is_verify) {
      toast.error(MESSAGES.LICENSE_PENDING);
      return false;
    }

    return true;
  };

  useEffect(() => {
    loadLicenseStatus();
  }, []);


const handlePlaceBid = async () => {
  const bidValue = Number(bid || 0);

  if (bidValue <= currentBid) {
  setError(MESSAGES.BID_TOO_LOW(currentBid));
    return;
  }

  try {
    setBidLoading(true);
    setError("");

    const allowed = await checkLoginAndLicense();
    if (!allowed) return;

    const bidRes = await placeBid(machineryId, auction_id, bidValue);

    if (!bidRes?.success) {
      throw new Error(bidRes?.message || "Bid failed");
    }

    toast.success(MESSAGES.BID_SUCCESS);
    onBidSuccess();
  } catch (err: any) {
    if (isAuthError(err)) {
      router.push(`/user/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }
    toast.error(err?.message || MESSAGES.BID_FAILED);
  } finally {
    setBidLoading(false);
  }
};
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const categorySlug = slugify(categoryName ?? "");
  const makeSlug = slugify(make ?? "");
  const modelSlug = slugify(model ?? "");

  const checkoutUrl =
    `/checkout/${categorySlug}/${makeSlug}/${modelSlug}/${auction_id}`;

  const licenseBlocked =
    !isLicenseStatusLoading &&
    (!licenseStatus.is_upload || licenseStatus.is_reject || !licenseStatus.is_verify);

  const licenseBlockMessage = !licenseStatus.is_upload
    ? "License not uploaded. Please verify your account before bidding or buying."
    : licenseStatus.is_reject
    ? "Your documents were rejected. Please re-upload valid documents."
    : !licenseStatus.is_verify
    ? "Verification pending. Please wait for approval before bidding or buying."
    : "";

 const handleBuyNow = async () => {
    try {
      setBuyLoading(true);

      const allowed = await checkLoginAndLicense();
      if (!allowed) return;

      localStorage.setItem(
        "checkoutProductId",
        machineryId.toString()
      );

      router.push(checkoutUrl);

    } catch (err: any) {
      toast.error(err?.message || MESSAGES.PURCHASE_FAILED);
    } finally {
      setBuyLoading(false);
    }
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-secgray">
        Place your bid
      </label>
      {licenseBlocked && (
        <div className="rounded-lg mb-4 p-3 bg-orange/10 border border-orange text-balck text-sm">
          {licenseBlockMessage}
        </div>
      )}

      <div className="flex items-stretch w-full rounded-xl overflow-hidden border border-lightgreen focus-within:ring-2 focus-within:ring-green">

        {/* $ + INPUT */}
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">$</span>

          <input
            type="text"
            value={bid}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-lg focus:outline-none"
            placeholder="Place your bid"
          />
        </div>

        {/* +100 BUTTON */}
        <button
          type="button"
          onClick={handlePlus}
          className="px-4 bg-green text-white text-sm font-medium hover:bg-green/90 transition-colors cursor-pointer"
        >
          + $100
        </button>
      </div>

      {/* ERROR */}
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      {/* PLACE BID BUTTON */}

      <button
        onClick={handlePlaceBid}
        disabled={bidLoading || !!error || licenseBlocked}
        className={`w-full py-[15px] rounded-lg text-base leading-[16px] font-medium mb-[15px] flex justify-center items-center gap-[10px] mont-text transition-all duration-300 mt-4 ${
          licenseBlocked
            ? "bg-gray-300 text-balck cursor-not-allowed"
            : "bg-green text-balck hover:brightness-110 hover:bg-green/90"
        }`}
      >
        {bidLoading ? (
          <>
            {/* Loader */}
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Image src="/assets/hammer.png" alt="icon" width={15} height={15} />
           BID from {formatPrice(bidNumber)}
          </>
        )}
      </button>

      <div className="text-center text-para text-lg leading-[18px] mb-[15px]">
        - OR -
      </div>
      <button
        onClick={handleBuyNow}
        disabled={buyLoading || licenseBlocked}
        className={`w-full py-[15px] rounded-lg text-base leading-[16px] font-medium flex justify-center items-center gap-[10px] border mont-text transition-all duration-300 ${
          licenseBlocked
            ? "bg-gray-100 text-balck border-gray-300 cursor-not-allowed"
            : "bg-white text-balck border-green hover:bg-green hover:text-white"
        }`}
      >
        {buyLoading ? (
    <>
      <span className="h-4 w-4 border-2 border-green border-t-transparent rounded-full animate-spin" />
      Processing...
    </>
  ) : (
    <>
      <Image src="/assets/bag-new.png" alt="icon" width={15} height={15} />
      Buy Now for  {formatPrice(buyNow)}
    </>
  )}
      </button>
    </div>
  );
}
