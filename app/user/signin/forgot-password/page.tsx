"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { JSX, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { forgotPassword } from "@/api/services";
import Image from "next/image";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPassword(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const cardVariant = {
    hidden: { opacity: 0, y: 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  } as const;

  const staggerVariant = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15, delayChildren: 0.25 },
    },
  } as const;

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  } as const;

  // const handleForgot = async (values: { email: string }, { resetForm }: any) => {
  //   try {
  //     const res = await forgotPassword(values);
  //       localStorage.setItem("reset_email", values.email);
  //     toast.success(res?.message || "Reset link sent to your email!");
  //     // setTimeout(() => {
  //     //     window.location.href = "/user/signin/verify-otp";
  //     //   }, 500);
  //     resetForm();
  //   } catch (error) {
  //     // api() wrapper already handles toast
  //   }
  // };

  const handleForgot = async (
    values: { email: string },
    { resetForm }: any,
  ) => {
    try {
      setLoading(true);
      const res = await forgotPassword(values);
      if (res?.status === true) {
        localStorage.setItem("reset_email", values.email);

        toast.success(res?.message || "Reset link sent to your email!");

        resetForm();

        // navigate only on success
        setTimeout(() => {
          window.location.href = "/user/signin/verify-otp";
        }, 500);
      }
    } catch (error: any) {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        "Something went wrong";

      toast.error(message); // ✅ SHOW ERROR
    } finally {
      setLoading(false); // ✅ STOP LOADING
    }
  };

  return (
    <>
      <div className="container-custom mx-auto bg-[#fff] rounded-[14px] p-[15px] grid grid-cols-12 section-space">
        <motion.div
          variants={cardVariant}
          initial="hidden"
          animate="show"
          className="rounded-r-[15px] rounded-[15px] lg:rounded-r-none p-5 md:p-10 col-span-12 lg:col-span-6 w-full shadow-[0_2px_35px_rgba(0,0,0,0.08)]"
        >
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl md:text-[42px] md:leading-[42px] font-bold text-center text-gray mb-[15px]"
          >
            Forgot Your <span className="text-orange">Password?</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-text-gray text-center mb-[25px] text-base"
          >
            We can help you reset it
          </motion.p>

          {/* Formik */}
          <Formik
            initialValues={{ email: "" }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleForgot}
          >
            {() => (
              <motion.div
                variants={staggerVariant}
                initial="hidden"
                animate="show"
              >
                <Form className="space-y-5">
                  {/* Email */}
                  <motion.div variants={itemVariant}>
                    <label className="text-lightblack font-medium mb-3 block text-base">
                      Email Address
                    </label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </motion.div>

                  {/* Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`  w-full py-[14px] rounded-[62px] font-semibold text-base
                          transition flex items-center justify-center gap-3 h-[42px] text-white bg-orange hover:opacity-90 cursor-pointer
    ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}
  `}
                  >
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <span>Reset it</span>{" "}
                        <Image
                          src="/assets/images/btn-right-errow.svg"
                          alt="Arrow"
                          width={18}
                          height={18}
                          className="transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-2"
                        />
                      </>
                    )}
                  </button>
                </Form>
              </motion.div>
            )}
          </Formik>

          {/* Bottom Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-center text-lightblack mt-[25px] text-lg  font-semibold"
          >
            <Link
              href="/user/signin"
              className="text-green flex items-center justify-center"
            >
              <span className="mr-1">
                <Image
                  src="/assets/images/left-arrow.svg"
                  alt="Back"
                  width={16}
                  height={16}
                />
              </span>
              Back to Signin
            </Link>
          </motion.p>
        </motion.div>
        <div className="relative col-span-12 lg:col-span-6 rounded-r-[15px]">
          <Image
            src="/assets/images/forgot-password.png"
            alt="Sign In"
            fill
            className="object-cover rounded-r-[15px]"
            priority
          />
        </div>
      </div>
    </>
  );
}
