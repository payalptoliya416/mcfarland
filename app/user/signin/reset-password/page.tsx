"use client";

import { JSX, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { resetPassword } from "@/api/services";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),

  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

export default function ResetPassword(): JSX.Element {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("reset_email");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      toast.error("Email missing! Please restart reset process.");
      window.location.href = "/user/forgot-password";
    }
  }, []);

  const handleReset = async (values: any, { resetForm }: any) => {
    if (!email) return;

    try {
      setLoading(true);

      const payload = {
        email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      };

      const res = await resetPassword(payload);

      toast.success(res?.message || "Password reset successful!");

      resetForm();

      setTimeout(() => {
        window.location.href = "/user/signin";
      }, 600);
    } catch (error: any) {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom mx-auto bg-[#F9F9F9] rounded-[14px] p-[20px] grid grid-cols-12 gap-5 min-h-[80vh] my-[60px]">
      {/* LEFT FORM CARD */}
      <div className="flex justify-center items-center col-span-12 lg:col-span-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full border border-border rounded-[15px] py-[55px] px-5 sm:px-[30px] bg-white"
        >
          {/* Title */}
          <h2 className="text-[32px] font-bold text-center mb-[10px] mont-text">
            Reset <span className="text-orange">Password</span>
          </h2>

          <p className="text-center text-text-gray mb-[30px]">
            Create your new password to continue.
          </p>

          {/* FORM */}
          <Formik
            initialValues={{
              password: "",
              password_confirmation: "",
            }}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleReset}
          >
            {() => (
              <Form className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="text-lightblack font-medium mb-3 block text-lg mont-text">
                    New Password
                  </label>

                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="w-full px-5 py-[14px] border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-green"
                    />

                    <span
                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff size={20} />
                      ) : (
                        <FiEye size={20} />
                      )}
                    </span>
                  </div>

                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-lightblack font-medium mb-3 block text-lg mont-text">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Field
                      name="password_confirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-full px-5 py-[14px] border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-green"
                    />

                    <span
                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={20} />
                      ) : (
                        <FiEye size={20} />
                      )}
                    </span>
                  </div>

                  <ErrorMessage
                    name="password_confirmation"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`
    w-full flex items-center justify-center gap-2
    bg-green text-white py-[14px] rounded-lg text-lg font-semibold transition cursor-pointer
    ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}
  `}
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>Reset Password →</>
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <p className="text-center mt-[25px] text-lg font-semibold mont-text">
            <Link href="/user/signin" className="text-green">
              ← Back to Signin
            </Link>
          </p>
        </motion.div>
      </div>

      {/* RIGHT PANEL IMAGE */}
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
