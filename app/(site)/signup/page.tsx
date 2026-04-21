"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { JSX, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { registerUser } from "@/api/services";
import { setToken } from "@/api/authToken";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { getCountryFromAddress } from "@/api/geoapify";

// Validation Schema
const CreateAccountSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  phone_no: Yup.string().required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  company_name: Yup.string().optional(),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State selection is required"),
  zip_code: Yup.string().required("Zip code is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
 terms: Yup.boolean()
  .oneOf([true], "You must accept the Terms & Privacy Policy")
  .required(),

marketing: Yup.boolean()
  .oneOf([true], "Please consent to receive marketing communications")
  .required(),
});

export default function CreateAccount(): JSX.Element {
  // Animation Variants
  const cardVariant = {
    hidden: { opacity: 0, y: 80 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  } as const;

  const staggerVariant = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  } as const;

  const itemVariant = {
    hidden: { opacity: 0, y: 25 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  } as const;

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const handleRegister = async (values: any, { resetForm }: any) => {
  try {
    setLoading(true);

    const payload = {
      ...values
    };

    const res = await registerUser(payload);

    if (res?.success === true) {
      if (res.token) {
        setToken(res.token);
      }
    if (res.data) {
        localStorage.setItem("userdata", JSON.stringify(res.data));
        window.dispatchEvent(new Event("user-login"));
      }
      toast.success("Account Created Successfully!");
      resetForm();

      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "signup_complete",
          step: "signup",
          is_new_signup: true,
          user_id: res.data?.id || undefined
        });
      }

      setTimeout(() => {
        window.location.href = "/verify-account";
      }, 800);
    }
 } catch (error: any) {
  let messages: string[] = [];

  if (error?.message) {
    messages.push(error.message);
  }

  if (error?.errors) {
    Object.values(error.errors).forEach((err: any) => {
      messages.push(err[0]); 
    });
  }

  if (messages.length) {
    toast.error(messages.join("\n")); 
  } else {
    toast.error("Registration failed");
  }
} finally {
  setLoading(false);
}

};

  return (
    <>
      <div className="w-full flex justify-center px-4 my-14">
        <motion.div
          variants={cardVariant}
          initial="hidden"
          animate="show"
          className="max-w-[900px] w-full border border-border rounded-[15px] p-[30px] bg-white"
        >
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl md:text-[38px] font-bold text-center text-gray mb-[15px] leading-[38px]  mont-text"
          >
            Create Your <span className="text-orange">Account</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-text-gray text-center mb-[30px]"
          >
            Buy, sell, or bid on high-quality industrial machinery with
            confidence.
          </motion.p>

          {/* Formik */}
          <Formik
            initialValues={{
              first_name: "",
              last_name: "",
              email: "",
              phone_no: "",
              address: "",
              company_name: "",
              city: "",
              state: "",
              zip_code: "",
              password: "",
              password_confirmation: "",
              terms: false,
              marketing: false,
            }}
            validationSchema={CreateAccountSchema}
            onSubmit={handleRegister}
          >
            {() => (
              <motion.div
                variants={staggerVariant}
                initial="hidden"
                animate="show"
              >
                <Form className="space-y-5">
                  {/* FIRST GRID */}
                  <motion.div
                    variants={itemVariant}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* First Name */}
                    <div>
                      <label className="text-lightblack font-medium text-lg mb-3  mont-text">
                        First Name <sup className="text-redmark">*</sup>
                      </label>
                      <Field
                        name="first_name"
                        placeholder="Enter your first name"
                        className="w-full mt-2 px-5 py-[13px] border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-green"
                      />
                      <ErrorMessage
                        name="first_name"
                        className="text-red-500 text-sm mt-1"
                        component="div"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="text-lightblack font-medium text-lg mb-3  mont-text">
                        Last Name <sup className="text-redmark">*</sup>
                      </label>
                      <Field
                        name="last_name"
                        placeholder="Enter your last name"
                        className="w-full mt-2 px-5 py-[13px] border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-green"
                      />
                      <ErrorMessage
                        name="last_name"
                        className="text-red-500 text-sm mt-1"
                        component="div"
                      />
                    </div>
                  </motion.div>

                  {/* SECOND GRID */}
                  <motion.div
                    variants={itemVariant}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* Email */}
                    <div>
                      <label className="text-lightblack font-medium text-lg mb-3  mont-text">
                        Email Address <sup className="text-redmark">*</sup>
                      </label>
                      <Field
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full mt-2 px-5 py-[13px] border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-green"
                      />
                      <ErrorMessage
                        name="email"
                        className="text-red-500 text-sm mt-1"
                        component="div"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-lightblack font-medium text-lg mb-3  mont-text">
                        Phone Number <sup className="text-redmark">*</sup>
                      </label>
                      <Field
                        name="phone_no"
                        placeholder="Enter your phone number"
                        className="w-full mt-2 px-5 py-[13px] border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-green"
                      />
                      <ErrorMessage
                        name="phone_no"
                        className="text-red-500 text-sm mt-1"
                        component="div"
                      />
                    </div>
                  </motion.div>

                  {/* Address */}
                  <motion.div variants={itemVariant}>
                    <label className="text-lightblack font-medium text-lg mb-3  mont-text">
                      Address <sup className="text-redmark">*</sup>
                    </label>
                    <Field
                      name="address"
                      placeholder="Enter your address"
                      className="w-full mt-2 px-5 py-[13px] border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-green"
                    />
                    <ErrorMessage
                      name="address"
                      className="text-red-500 text-sm mt-1"
                      component="div"
                    />
                  </motion.div>

                  {/* GRID 3 (Company & City) */}
                  <motion.div
                    variants={itemVariant}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div>
                      <label className="text-lightblack font-medium text-lg mb-3  mont-text">
                        Company Name
                      </label>
                      <Field
                        name="company_name"
                        placeholder="Optional"
                        className="w-full mt-2 px-5 py-[13px] border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-green"
                      />
                      <ErrorMessage
                        name="company_name"
                        className="text-red-500 text-sm mt-1"
                        component="div"
                      />
                    </div>

                    <div>
                      <label className="text-lightblack font-medium text-lg mb-3  mont-text">
                        City <sup className="text-redmark">*</sup>
                      </label>
                      <Field
                        name="city"
                        placeholder="Enter City"
                        className="w-full mt-2 px-5 py-[13px] border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-green"
                      />
                      <ErrorMessage
                        name="city"
                        className="text-red-500 text-sm mt-1"
                        component="div"
                      />
                    </div>
                  </motion.div>

                  {/* GRID 4 (State & Zip) */}
                  <motion.div
                    variants={itemVariant}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* State */}
                    <div>
                      <label className="text-lightblack font-medium text-lg mb-3 mont-text">
                        State <sup className="text-redmark">*</sup>
                      </label>

                      <Field
                        name="state"
                        placeholder="Enter your state"
                        className="w-full mt-2 px-5 py-[13px] border border-border rounded-xl outline-none focus:ring-2 focus:ring-green"
                      />

                      <ErrorMessage
                        name="state"
                        className="text-red-500 text-sm mt-1"
                        component="div"
                      />
                    </div>

                    {/* Zip */}
                    <div>
                      <label className="text-lightblack font-medium text-lg mb-3 mont-text">
                        Zip Code <sup className="text-redmark">*</sup>
                      </label>
                      <Field
                        name="zip_code"
                        placeholder="Enter zip code"
                        autoComplete="postal-code"
                        className="w-full mt-2 px-5 py-[13px] border border-border rounded-xl outline-none focus:ring-2 focus:ring-green"
                      />
                      <ErrorMessage
                        name="zip_code"
                        className="text-red-500 text-sm mt-1"
                        component="div"
                      />
                    </div>
                  </motion.div>

                  {/* Password Fields */}
                  <motion.div
                    variants={itemVariant}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* Password */}
                    <div className="">
                      <label className="text-lightblack font-medium text-lg mb-2 mont-text">
                        Password <sup className="text-redmark">*</sup>
                      </label>
                      <div className="relative mt-3">
                        <Field
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          autoComplete="new-password"
                          className="w-full px-5 py-[13px] border border-border rounded-xl outline-none focus:ring-2 focus:ring-green pr-12"
                        />

                        {/* Eye Icon */}
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                          {showPassword ? (
                            <FiEyeOff size={20} />
                          ) : (
                            <FiEye size={20} />
                          )}
                        </button>
                      </div>

                      <ErrorMessage
                        name="password"
                        className="text-red-500 text-sm mt-1"
                        component="div"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="">
                      <label className="text-lightblack font-medium text-lg mb-2 mont-text">
                        Confirm Password <sup className="text-redmark">*</sup>
                      </label>
                      <div className="relative mt-3">
                        <Field
                          name="password_confirmation"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Enter your confirm password"
                          autoComplete="new-password"
                          className="w-full px-5 py-[13px] border border-border rounded-xl outline-none focus:ring-2 focus:ring-green pr-12"
                        />

                        {/* Eye Icon */}
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((p) => !p)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                          {showConfirmPassword ? (
                            <FiEyeOff size={20} />
                          ) : (
                            <FiEye size={20} />
                          )}
                        </button>
                      </div>

                      <ErrorMessage
                        name="password_confirmation"
                        className="text-red-500 text-sm mt-1"
                        component="div"
                      />
                    </div>
                  </motion.div>

                  {/* Checkboxes */}
                  <motion.div variants={itemVariant} className="space-y-[22px]">
                    {/* TERMS CHECKBOX */}
                    <label className="flex items-start gap-3 text-para cursor-pointer select-none mb-1">
                      {/* Custom Checkbox Wrapper */}
                      <div className="relative">
                        <Field
                          type="checkbox"
                          name="terms"
                          className="
          peer appearance-none w-5 h-5 border border-[#CFCFCF] rounded-sm 
          checked:bg-green checked:border-green transition cursor-pointer
        "
                        />

                        {/* Tick icon */}
                        <svg
                          className="
          absolute left-[3px] top-[2px] w-4 h-4 hidden peer-checked:block 
          pointer-events-none fill-none stroke-white stroke-[3px]
        "
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>

                      <span>
                        I agree to the{" "}
                        <span className="text-green font-semibold">
                          Terms of Service
                        </span>{" "}
                        and{" "}
                        <span className="text-green font-semibold">
                          Privacy Policy
                        </span>
                      </span>
                    </label>

                    <ErrorMessage
                      name="terms"
                      className="text-red-500 text-sm"
                      component="div"
                    />

                    {/* MARKETING CHECKBOX */}
                    <label className="flex items-start gap-3 text-para cursor-pointer select-none mb-1">
                      {/* Custom Checkbox Wrapper */}
                      <div className="relative">
                        <Field
                          type="checkbox"
                          name="marketing"
                          className="peer appearance-none w-5 h-5 border border-[#CFCFCF] rounded-sm 
                     checked:bg-green checked:border-green transition cursor-pointer"
                        />

                        {/* Tick icon */}
                        <svg
                          className="absolute left-[3px] top-[2px] w-4 h-4 hidden peer-checked:block 
                        pointer-events-none fill-none stroke-white stroke-[3px]"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>

                      <span>
                        I would like to receive marketing communications about
                        products, services, and promotions.
                      </span>
                    </label>
                    <ErrorMessage
                name="marketing"
                className="text-red-500 text-sm"
                component="div"
              />
                  </motion.div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`
                    w-full py-[13px] rounded-lg font-semibold text-lg leading-[18px] text-white cursor-pointer
                    transition flex items-center justify-center gap-2
                    ${
                      loading
                        ? "bg-green/70 cursor-not-allowed"
                        : "bg-green hover:opacity-90"
                    }
                  `}
                  >
                    {loading ? (
                      <>
                        <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
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
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-center text-lightblack mt-[30px]  mont-text font-semibold"
          >
            Already have an account?{" "}
            <Link href="/user/signin" className="text-green">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}
