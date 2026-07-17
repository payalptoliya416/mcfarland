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
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { sendSMS } from "@/api/sms/sendSMS";
import { useSettings } from "@/contexts/SettingsContext";
import Image from "next/image";

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

function CreateAccountInner(): JSX.Element {
  const searchParams = useSearchParams();
  const rawReturnUrl = searchParams.get("returnUrl");
  const returnUrl = rawReturnUrl ? decodeURIComponent(rawReturnUrl) : null;
    const { companyName } = useSettings();
  
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

       toast.success(
        "Account Created Successfully!"
      );

      resetForm();

      try {
        const smsRes = await sendSMS({
          phone: values.phone_no,
          type: "registration",
          companyName:
           `${companyName}` ||
            "Eastline Equipment Sales & Auctions",
        });

      } catch (smsError) {
        console.log(
          "SMS ERROR:",
          smsError
        );
      }

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
        const verifyUrl = returnUrl
          ? `/verify-account?returnUrl=${encodeURIComponent(returnUrl)}`
          : "/verify-account";
        window.location.href = verifyUrl;
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
     <div className="container-custom mx-auto bg-[#fff] rounded-[14px] p-[15px] grid grid-cols-12 section-space">
         <motion.div
          variants={cardVariant}
          initial="hidden"
          animate="show"
          className="rounded-r-[15px] rounded-[15px] lg:rounded-r-none p-5 md:p-10 col-span-12 lg:col-span-6 w-full shadow-[0_2px_35px_rgba(0,0,0,0.08)]"
        >
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
             className="text-3xl md:text-[42px] md:leading-[42px] font-bold text-center text-gray mb-[15px]"
          >
            Create Your <span className="text-orange">Account</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
             className="text-text-gray text-center mb-[25px] text-base"
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
                      <label className="text-lightblack font-medium mb-3 block text-base">
                        First Name <sup className="text-redmark">*</sup>
                      </label>
                      <Field
                        name="first_name"
                        placeholder="Enter your first name"
                        className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
                      />
                      <ErrorMessage
                        name="first_name"
                        className="text-red-500 text-sm mt-1"
                        component="div"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="text-lightblack font-medium mb-3 block text-base">
                        Last Name <sup className="text-redmark">*</sup>
                      </label>
                      <Field
                        name="last_name"
                        placeholder="Enter your last name"
                        className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
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
                      <label className="text-lightblack font-medium mb-3 block text-base">
                        Email Address <sup className="text-redmark">*</sup>
                      </label>
                      <Field
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
                      />
                      <ErrorMessage
                        name="email"
                        className="text-red-500 text-sm mt-1"
                        component="div"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-lightblack font-medium mb-3 block text-base">
                        Phone Number <sup className="text-redmark">*</sup>
                      </label>
                      <Field
                        name="phone_no"
                        placeholder="Enter your phone number"
                        className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
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
                    <label className="text-lightblack font-medium mb-3 block text-base">
                      Address <sup className="text-redmark">*</sup>
                    </label>
                    <Field
                      name="address"
                      placeholder="Enter your address"
                      className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
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
                      <label className="text-lightblack font-medium mb-3 block text-base">
                        Company Name
                      </label>
                      <Field
                        name="company_name"
                        placeholder="Optional"
                        className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
                      />
                      <ErrorMessage
                        name="company_name"
                        className="text-red-500 text-sm mt-1"
                        component="div"
                      />
                    </div>

                    <div>
                      <label className="text-lightblack font-medium mb-3 block text-base">
                        City <sup className="text-redmark">*</sup>
                      </label>
                      <Field
                        name="city"
                        placeholder="Enter City"
                        className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
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
                      <label className="text-lightblack font-medium text-lg mb-3">
                        State <sup className="text-redmark">*</sup>
                      </label>

                      <Field
                        name="state"
                        placeholder="Enter your state"
                        className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
                      />

                      <ErrorMessage
                        name="state"
                        className="text-red-500 text-sm mt-1"
                        component="div"
                      />
                    </div>

                    {/* Zip */}
                    <div>
                      <label className="text-lightblack font-medium text-lg mb-3">
                        Zip Code <sup className="text-redmark">*</sup>
                      </label>
                      <Field
                        name="zip_code"
                        placeholder="Enter zip code"
                        autoComplete="postal-code"
                        className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
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
                      <label className="text-lightblack font-medium text-lg mb-2">
                        Password <sup className="text-redmark">*</sup>
                      </label>
                      <div className="relative mt-3">
                        <Field
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          autoComplete="new-password"
                          className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
                        />

                        {/* Eye Icon */}
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A5A4A3] hover:text-gray-700 cursor-pointer"
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
                      <label className="text-lightblack font-medium text-lg mb-2">
                        Confirm Password <sup className="text-redmark">*</sup>
                      </label>
                      <div className="relative mt-3">
                        <Field
                          name="password_confirmation"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          autoComplete="new-password"
                          className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
                        />

                        {/* Eye Icon */}
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((p) => !p)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A5A4A3] hover:text-gray-700 cursor-pointer"
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
                    <label className="flex items-start gap-3 text-[#4D4D4D] cursor-pointer select-none mb-1">
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
                      <Link href="/terms-condition" className="text-green font-semibold">
                          Terms of Service
                      </Link>
                      {" "}
                        and{" "}
                        <Link href="/privacy-policy" className="text-green font-semibold">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>

                    <ErrorMessage
                      name="terms"
                      className="text-red-500 text-sm"
                      component="div"
                    />

                    {/* MARKETING CHECKBOX */}
                    <label className="flex items-start gap-3 text-[#4D4D4D] cursor-pointer select-none mb-1">
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
                    w-full py-[14px] rounded-[62px] font-semibold text-base
                          transition flex items-center justify-center gap-3 h-[42px] text-white
                    ${
                      loading
                        ? "bg-green/70 cursor-not-allowed"
                        : "bg-green hover:opacity-90 cursor-pointer"
                    }
                  `}
                  >
                    {loading ? (
                      <>
                        <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                     <> 
                     Create Account <img src="/assets/images/btn-right-errow.svg" alt="" />
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
            transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center text-lightblack mt-[30px] text-base xl:text-xl font-semibold"
          >
            Already have an account?{" "}
            <Link href={`/user/signin${rawReturnUrl ? `?returnUrl=${rawReturnUrl}` : ""}`} className="text-green">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
        <div className="relative col-span-12 lg:col-span-6 rounded-r-[15px]">
                <Image
                  src="/assets/images/create-account.png"
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

export default function CreateAccount() {
  return (
    <Suspense fallback={null}>
      <CreateAccountInner />
    </Suspense>
  );
}
