"use client";

import { JSX, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { verifyOtp } from "@/api/services";
import Image from "next/image";

export default function VerifyOtp(): JSX.Element {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   const savedEmail = localStorage.getItem("reset_email");
  //   if (savedEmail) {
  //     setEmail(savedEmail);
  //   } else {
  //     toast.error("Email not found! Please try again.");
  //     window.location.href = "/user/signin/forgot-password";
  //   }
  // }, []);
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otpValues];
    updated[index] = value;
    setOtpValues(updated);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && otpValues[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otp = otpValues.join("").trim();

    if (otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    if (!email || email.trim() === "") {
      toast.error("Email is missing!");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp({ email, otp });
      if (res?.status === true) {
        toast.success(res?.message || "OTP verified!");

        setTimeout(() => {
          window.location.href = "/user/signin/reset-password";
        }, 800);
      } else {
        toast.error(res?.message || "Invalid OTP!");
      }
    } catch (error: any) {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        "Invalid OTP or email";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="container-custom mx-auto bg-[#fff] rounded-[14px] p-[15px] grid grid-cols-12 section-space">
      {/* LEFT SIDE CARD */}
      <div className="flex justify-center items-center col-span-12 lg:col-span-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
           className="rounded-r-[15px] rounded-[15px] lg:rounded-r-none p-5 md:p-10 col-span-12 lg:col-span-6 w-full shadow-[0_2px_35px_rgba(0,0,0,0.08)]"
        >
          {/* TITLE */}
          <h2 className="text-3xl md:text-[42px] md:leading-[42px] font-bold text-center text-gray mb-[15px]">
            Verify <span className="text-orange">OTP</span>
          </h2>

          <p className="text-text-gray text-center mb-[25px] text-base">
            Enter the 4-digit verification code sent to your email.
          </p>

          {/* OTP INPUTS */}
          <div className="flex justify-center gap-3 mb-8">
            {otpValues.map((value, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="
                  w-13 h-13 border border-border rounded-lg 
                  text-center text-2xl font-semibold 
                  outline-none focus:border-green bg-white
                "
              />
            ))}
          </div>

          {/* VERIFY BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`
     w-full py-[14px] rounded-[62px] font-semibold text-base transition flex items-center justify-center gap-3 h-[42px] text-white bg-orange hover:opacity-90 cursor-pointer
    ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}
  `}
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>Verify OTP →</>
            )}
          </button>

          <p className="text-center mt-[25px] text-lg font-semibold">
            <Link href="/user/signin/forgot-password" className="text-green flex justify-center items-center">
              <span className="mr-1"><img src="/assets/images/left-arrow.svg" alt="" /></span>  Back to Forgot Password
            </Link>
          </p>
        </motion.div>
      </div>

      {/* RIGHT IMAGE */}
       <div className="relative col-span-12 lg:col-span-6 rounded-r-[15px]">
                 <Image
                   src="/assets/images/signin.png"
                   alt="Sign In"
                   fill
                   className="object-cover rounded-r-[15px]"
                   priority
                 />
               </div>
    </div>
  );
}
