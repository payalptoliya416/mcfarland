"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  getLicenseStatus,
  uploadLicense,
} from "@/api/user/license";
import { getUserProfile, UserProfile } from "@/api/user/profile";
import { useEffect } from "react";
import { getCountryFromAddress } from "@/api/geoapify";
import { UploadBox } from "./UploadBox";
import { useRouter, useSearchParams } from "next/navigation";
const REQUIRES_BACK = true;

export default function VerifyAccount() {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const [verifying, setVerifying] = useState(false);

  // useEffect(() => {
  //   getUserProfile().then((res) => {
  //     if (res.status) setProfile(res.data);
  //   });
  // }, []);

  const requiresBack = REQUIRES_BACK;
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileAndCountry = async () => {
      const res = await getUserProfile();
      if (!res.status) return;

      setProfile(res.data);

      try {
        const geo = await getCountryFromAddress(
          res.data.address,
          res.data.city,
          res.data.state,
          res.data.zip_code,
        );

        if (!geo?.country_code) {
          setCountry("USA");
          return;
        }

        setCountry(geo.country_code);
      } catch (err) {
        setCountry("USA");
      }
    };

    loadProfileAndCountry();
  }, []);

  useEffect(() => {
    const originalPath = window.location.pathname;

    const blockAnchorNavigation = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a");
      if (anchor) {
        event.preventDefault();
        event.stopPropagation();
        toast("Complete verification first before navigating away.");
      }
    };

    const onPopState = () => {
      if (window.location.pathname !== originalPath) {
        window.history.pushState(null, "", originalPath);
      }
    };

    document.body.classList.add("verify-account-block-navigation");
    document.addEventListener("click", blockAnchorNavigation, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.body.classList.remove("verify-account-block-navigation");
      document.removeEventListener("click", blockAnchorNavigation, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!frontFile) {
      toast.error("Please upload document");
      return;
    }

    if (requiresBack && !backFile) {
      toast.error("Back side is required for this document");
      return;
    }

    if (!profile?.email) {
      toast.error("User profile not found. Please log in.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("front", frontFile);

      if (requiresBack && backFile) {
        formData.append("back", backFile);
      }

      formData.append("docType", "DRIVERS");
      if (country) {
        formData.append("country", country);
      }

      const res = await uploadLicense(formData);

      if (!res.status) {
        toast.error(res.message || "Upload failed");
        setUploading(false);
        return;
      }
      setUploading(false);
      setVerifying(true);
      
      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "verify_account_complete",
          step: "verify_account",
          user_id: profile?.id || undefined
        });
      }
      
      await new Promise((resolve) => setTimeout(resolve, 30000));
      await getLicenseStatus();
      router.push(returnUrl);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
      setUploading(false);
      setVerifying(false);
    }
  };

  return (
    <div className="my-[110px] flex justify-center px-4">
      <div className="border rounded-[15px] p-[30px] max-w-[650px] w-full border-border">
        <h3 className="text-3xl text-center mb-6 font-semibold">
          Verify your <span className="text-orange">account</span>
        </h3>
        <div className="mb-6 rounded-lg p-1 text-orange">
          <p className="text-sm font-medium">
            This step is mandatory. You must complete identity verification before continuing.
          </p>
        </div>
          {verifying && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl text-center shadow-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange border-t-transparent mx-auto mb-4"></div>
                <p className="text-lg font-semibold">
                  Verifying your license...
                </p>
              </div>
            </div>
          )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UploadBox
              label="Upload the front of your Driver’s License"
              file={frontFile}
              onChange={setFrontFile}
            />

            {requiresBack && (
              <UploadBox
                label="Upload the back of your Driver’s License"
                file={backFile}
                onChange={setBackFile}
              />
            )}
          </div>
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={
                uploading ||
                verifying ||
                !frontFile ||
                (requiresBack && !backFile)
              }
              className={`px-6 py-3 rounded-lg text-white ${
                uploading || !frontFile || (requiresBack && !backFile)
                  ? "bg-gray-400"
                  : "bg-green  cursor-pointer "
              }`}
            >
              {uploading
                ? "Uploading..."
                : verifying
                  ? "Verifying..."
                  : "Submit"}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
