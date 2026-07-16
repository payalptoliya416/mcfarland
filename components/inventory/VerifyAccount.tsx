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
  const requiresBack = REQUIRES_BACK;
  const [country, setCountry] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

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
  
    const fetchProfile = async () => {
    try {
      const res = await getUserProfile();
      if (res.status) {
         setProfile(res.data); 
      }
    } catch (error) {
      console.error("Profile fetch failed", error);
    } 
  };

  useEffect(()=>{
    fetchProfile();
  },[]);

  useEffect(() => {
  const submitted = localStorage.getItem("license_submitted");
  if (submitted === "true") {
    setHasSubmitted(true);
  }
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
  setVerifying(true);

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
      setHasSubmitted(true);
      localStorage.setItem("license_submitted", "true");

      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "verify_account_complete",
          step: "verify_account",
          user_id: profile?.id || undefined
        });
      }
      
      await new Promise((resolve) => setTimeout(resolve, 30000));

     setTimeout(async () => {
    await getLicenseStatus();
    await fetchProfile();
    const updatedProfile = await getUserProfile();

    if (updatedProfile?.status) {
      setProfile(updatedProfile.data);

      if (updatedProfile.data.is_license === 1) {
        router.push(returnUrl);
      } else {
        setVerifying(false);
      }
    } else {
      setVerifying(false);
    }
  }, 5000);

    } catch (err: any) {
      toast.error(err.message || "Upload failed");
      setUploading(false);
      setVerifying(false);
    }
  };

  const getLicenseMessageConfig = (isLicense: number) => {
    switch (isLicense) {
      case 0: // Pending
        return {
          type: "pending",
          bg: "bg-[#FFF8E6] border border-[#FFE1A3] text-[#A26A00]",
          message:
            "Your license is under verification. Please wait while we review your document.",
        };

      case 1: // Verified
        return {
          type: "verified",
          bg: "bg-[#E8F8EE] border border-[#BFE8D1] text-[#2E7D32]",
          message:
            "Your license has been verified successfully. You can now complete purchases.",
        };

      case 2: // Declined
        return {
          type: "declined",
          bg: "bg-[#FFECEC] border border-[#FFBABA] text-[#D32F2F]",
          message:
            "Your license could not be verified. Please review the details and resubmit.",
        };

      default:
        return {
          type: "unverified",
          bg: "bg-[#F2F2F2] border border-[#E0E0E0] text-[#616161]",
          message: "Please upload your license document for verification.",
        };
    }
  };

  return (
    <>
      <section className="p-5 -mt-[145px]  pb-0">
      <div
        className="relative rounded-3xl overflow-hidden min-h-[410px] bg-cover bg-center bg-[url(/assets/images/verify-account.png)] flex justify-center items-center md:bg-[length:100%_100%] bg-no-repeat"
      >
        <div className="relative z-10 flex items-center justify-center min-h-[410px]">
          <div className="custom-container text-center text-white">
            <h1 className="mx-auto max-w-5xl text-center text-[28px] font-extrabold leading-[40px] sm:text-[42px] sm:leading-[52px] md:text-[48px] md:leading-[58px] lg:text-[60px] lg:leading-[72px] mb-5">
            Verify  {" "}
              <span className="text-primary">
                Your Account
              </span>{" "} 
              Securely
            </h1>

            <p className="mx-auto max-w-[700px] px-4 text-center text-sm font-medium leading-6 text-white sm:text-base sm:leading-[26px]">
         To ensure a safe and trusted marketplace experience, please upload your identification document to complete account verification before making a purchase.
            </p>
          </div>
        </div>

      </div>
    </section>
    <div className="section-space flex justify-center">
      <div className="rounded-[15px] p-[30px] max-w-[594px] w-full shadow-[0_2px_35px_rgba(0,0,0,0.08)]">
       <div className="flex justify-center mb-10">
         <div  className="w-[98px] h-[98px] flex items-center justify-center bg-[url('/assets/images/border-bg.png')] bg-contain bg-center bg-no-repeat"><img src="/assets/images/verify-icon.svg" alt="" /></div>
       </div>
        <h3 className="text-[38px] text-center mb-[15px] font-semibold">
          Verify your <span className="text-orange">account</span>
        </h3>
        <div className="mb-6 rounded-lg p-1 text-orange">
          <p className="text-sm font-medium">
            This step is mandatory. You must complete identity verification before continuing.
          </p>
        </div>
          {verifying && profile && (
            (() => {
              const config = getLicenseMessageConfig(profile.is_license);

              return (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-8 rounded-xl text-center shadow-xl max-w-[500px] w-full mx-3">
                    
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange border-t-transparent mx-auto mb-4"></div>

                    <p className="text-lg font-semibold mb-2">
                      Verifying your license...
                    </p>

                    <div className={`p-3 rounded-lg text-sm ${config.bg}`}>
                      {config.message}
                    </div>

                  </div>
                </div>
              );
            })()
          )}

      {hasSubmitted && profile && (
          (() => {
            const config = getLicenseMessageConfig(profile.is_license);

            return (
              <div className={`mb-5 px-4 py-2 rounded-lg text-sm flex items-start gap-3 ${config.bg}`}>
                  <p className="font-medium capitalize">{config.type} : {config.message}</p>
              </div>
            );
          })()
        )}

        <form onSubmit={handleSubmit} className="space-y-[30px]">
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
              className={`py-[14px] px-[25px] rounded-[62px] font-semibold text-base transition flex items-center justify-center gap-3 h-[42px] text-white bg-orange hover:opacity-90 cursor-pointer ${
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
    </>
  );
}
