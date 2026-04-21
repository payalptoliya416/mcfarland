"use client";

import { JSX, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { verifyOtp } from "@/api/services";

export default function VerifyOtp(): JSX.Element {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const savedEmail = localStorage.getItem("reset_email");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      toast.error("Email not found! Please try again.");
      window.location.href = "/user/signin/forgot-password";
    }
  }, []);
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
    <div className="container-custom mx-auto bg-[#F9F9F9] rounded-[14px] p-[20px] grid grid-cols-12 gap-5 min-h-[80vh] my-[60px]">
      {/* LEFT SIDE CARD */}
      <div className="flex justify-center items-center col-span-12 lg:col-span-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full border border-border rounded-[15px] py-[55px] px-5 sm:px-[30px] bg-white"
        >
          {/* TITLE */}
          <h2 className="text-[32px] font-bold text-center mb-[10px] mont-text">
            Verify <span className="text-orange">OTP</span>
          </h2>

          <p className="text-center text-text-gray mb-[30px]">
            Enter the 4-digit verification code sent to your email.
          </p>

          {/* EMAIL INPUT */}
          {/* <input
            type="email"
            placeholder="Enter your email"
            className="w-full mb-6 px-5 py-[14px] border border-border rounded-lg outline-none focus:ring-2 focus:ring-green"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /> */}

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
                  w-14 h-14 border border-border rounded-lg 
                  text-center text-2xl font-semibold 
                  outline-none focus:ring-2 focus:ring-green bg-white
                "
              />
            ))}
          </div>

          {/* VERIFY BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`
    w-full flex items-center justify-center gap-2
    bg-green text-white py-[14px] rounded-lg 
    text-lg font-semibold transition cursor-pointer
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

          <p className="text-center mt-[25px] text-lg font-semibold mont-text">
            <Link href="/user/signin/forgot-password" className="text-green">
              ← Back to Forgot Password
            </Link>
          </p>
        </motion.div>
      </div>

      {/* RIGHT IMAGE */}
      <div
        className="
              relative 
              col-span-12 lg:col-span-6 
              w-full h-[300px] lg:h-full 
              rounded-2xl overflow-hidden shadow-md
              bg-cover bg-center
            "
        style={{ backgroundImage: "url('/assets/user-bg-new.png')" }}
      >
        {/* DARK OVERLAY (Improves readability) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* TEXT BLOCK */}
        <div className="absolute bottom-4 left-4 right-4 lg:bottom-10 lg:left-10 lg:right-10 text-white">
          <h2 className="text-2xl lg:text-[32px] font-bold leading-snug lg:leading-[48px] mb-[10px] mont-text">
            Manage Your Equipment Deals with Confidence
          </h2>

          <p className="text-base lg:text-lg leading-[22px] lg:leading-[26px]">
            Track bids, purchases, and deliveries – all from one simple
            dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
