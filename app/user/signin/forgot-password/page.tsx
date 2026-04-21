"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { JSX, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { forgotPassword } from "@/api/services";

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
  { resetForm }: any
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

  }catch (error: any) {
  const message =
    error?.message ||
    error?.response?.data?.message ||
    "Something went wrong";

  toast.error(message); // ✅ SHOW ERROR
}finally {
    setLoading(false); // ✅ STOP LOADING
  }
};

  return (
    <>
     <div className="container-custom mx-auto bg-[#fff] rounded-[14px] p-[15px] grid grid-cols-12 gap-5 h-full lg:min-h-[750px]  my-[60px]">
      <div className="flex justify-center items-center col-span-12 lg:col-span-6 w-full">
      <motion.div
        variants={cardVariant}
        initial="hidden"
        animate="show"
        className="border border-border rounded-[15px] py-[55px] px-5 sm:px-[30px] w-full"
      >
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[38px] font-bold text-center text-gray mb-[15px] mont-text"
        >
          Forgot Your <span className="text-orange">Password?</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-text-gray text-center mb-[30px]"
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
                  <label className="text-lightblack font-medium mb-3  mont-text">
                    Email Address
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full mt-2 px-5 py-[18px] border border-border rounded-[10px] outline-none
                     focus:ring-2 focus:ring-green text-base leading-[16px]"
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
  className={`w-full flex items-center justify-center gap-2 bg-green text-white py-[14px] rounded-lg text-lg transition mont-text font-semibold cursor-pointer
    ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}
  `}
>
  {loading ? (
    <>
      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Sending...
    </>
  ) : (
    <>Reset it →</>
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
          className="text-center text-lightblack mt-[25px] text-lg  mont-text font-semibold"
        >
          <Link href="/user/signin" className="text-green">
             <span className="mr-1">←</span> Back to Signin
          </Link>
        </motion.p>
      </motion.div>
      </div>
      {/* Card */}
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
                Track bids, purchases, and deliveries – all from one simple dashboard.
              </p>

            </div>

          </div>
     </div>
    </>
  );
}
