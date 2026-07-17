"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { JSX, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { LoginPayload } from "@/types/siteType";
import { loginUser } from "@/api/services";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/api/authToken";
import { FiEye, FiEyeOff } from "react-icons/fi";
  import Image from "next/image";

// Validation Schema
const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignInForm(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const rawReturnUrl = searchParams.get("returnUrl");
  const returnUrl = rawReturnUrl ? decodeURIComponent(rawReturnUrl) : "/user";

  // Variants
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

  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    values: LoginPayload & { remember?: boolean },
    { resetForm }: { resetForm: () => void },
  ) => {
    setLoading(true);

    try {
      const res = await loginUser(values);

      if (res?.status === true) {
        toast.success("Login Successful!");

        setToken(res.token);
        localStorage.setItem("userdata", JSON.stringify(res.user));
        window.dispatchEvent(new Event("user-login"));
        if (values.remember) {
          localStorage.setItem("rememberEmail", values.email);
          localStorage.setItem("rememberPassword", values.password);
        } else {
          localStorage.removeItem("rememberEmail");
          localStorage.removeItem("rememberPassword");
        }

        resetForm();
        router.push(returnUrl);
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl md:text-[42px] md:leading-[42px] font-bold text-center text-gray mb-[15px]"
          >
            Sign In your <span className="text-orange">account</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-text-gray text-center mb-[25px] text-base"
          >
            Enter your email and password to access your account.
          </motion.p>

          {/* Formik */}
          <Formik
            initialValues={{
              email:
                typeof window !== "undefined"
                  ? localStorage.getItem("rememberEmail") || ""
                  : "",
              password:
                typeof window !== "undefined"
                  ? localStorage.getItem("rememberPassword") || ""
                  : "",
              remember:
                typeof window !== "undefined"
                  ? !!localStorage.getItem("rememberEmail")
                  : false,
            }}
            validationSchema={SignInSchema}
            onSubmit={handleLogin}
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
                      autoComplete="email"
                      placeholder="Enter your email address"
                      className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </motion.div>

                  {/* Password */}
                  <motion.div variants={itemVariant}>
                    <label className="text-lightblack font-medium block text-base mb-3">
                      Password
                    </label>

                    <div className="relative">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
                      />

                      {/* 👁 Eye Icon */}
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
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
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </motion.div>

                  {/* Remember / Forgot */}
                  <motion.div
                    variants={itemVariant}
                    className="flex justify-between items-center flex-wrap gap-2 mb-[30px]"
                  >
                    <label className="flex items-center gap-2 cursor-pointer select-none text-para">
                      <Field
                        type="checkbox"
                        name="remember"
                        className="peer appearance-none w-5 h-5 border border-border rounded-[6px] checked:bg-green checked:border-green transition flex justify-center items-center cursor-pointer"
                      />
                      <span>Remember me</span>

                      {/* Custom Tick */}
                      <svg
                        className="absolute w-4 h-4 pointer-events-none fill-none stroke-white stroke-[3px] 
                                hidden peer-checked:block ml-[2px]"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </label>

                    <Link
                      href="/user/signin/forgot-password"
                      className="text-para"
                    >
                      Forgot password?
                    </Link>
                  </motion.div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                     className={`
                    group w-full h-[42px] rounded-[62px] py-[14px]
                    flex items-center justify-center gap-3
                    text-base font-semibold text-white
                    transition-all duration-300 ease-out
                    ${
                      loading
                        ? "bg-green/70 cursor-not-allowed"
                        : "bg-green cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(242,103,28,0.35)] active:translate-y-[2px] active:scale-[0.97]"
                    }
                  `}
                  >
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing In... 
                      </>
                    ) : (
                      <>Sign In <img src="/assets/images/btn-right-errow.svg" alt="" /></>
                    )}
                  </button>

                  {/* Divider */}
                  {/* <motion.div variants={itemVariant} className="flex items-center gap-4">
                      <div className="flex-1 h-[1px] bg-gray-300"></div>
                      <span className="text-gray-500">OR</span>
                      <div className="flex-1 h-[1px] bg-gray-300"></div>
                    </motion.div> */}

                  {/* Google Button */}
                  {/* <button
                      className="w-full flex items-center justify-center gap-3 border border-border rounded-[10px] py-[18px] hover:bg-gray-50 transition text-lightblack text-base sm:text-lg cursor-pointer  font-semibold"
                      type="button"
                    >
                      <Image
                        src="/assets/googleicon.png"
                        alt="Google"
                        width={24}
                        height={24}
                      />
                      Continue with Google
                    </button> */}
                </Form>
              </motion.div>
            )}
          </Formik>

          {/* Bottom Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-center text-lightblack mt-[30px] text-base xl:text-xl font-semibold"
          >
            Don't have an account?{" "}
            <Link href={`/signup${rawReturnUrl ? `?returnUrl=${rawReturnUrl}` : ""}`} className="text-green">
              Create account
            </Link>
          </motion.p>
        </motion.div>
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
    </>
  );
}
