"use client";

import Image from "next/image";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { adminAuthService } from "@/api/admin/auth";
import { getAdminToken, saveAdminToken } from "@/api/admin/adminAuth";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

/* ================= VALIDATION SCHEMA ================= */
const LoginSchema = Yup.object({
  email: Yup.string().trim().required("Username or Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

/* ================= TYPES ================= */
interface LoginFormValues {
  email: string;
  password: string;
}

/* ================= PAGE ================= */
export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
useEffect(() => {
  const token = getAdminToken();
  if (token) {
    router.push("/admin/dashboard");
  }
}, [router]);
  /* ================= SUBMIT HANDLER ================= */
  const handleLogin = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      const res = await adminAuthService.login(values);
      // ✅ Save admin token with expiry (24 hrs)
      saveAdminToken(res.token, res.expires_in, {
        name: res.admin.name,
        email: res.admin.email,
      });

      toast.success(res.message || "Login successful");

      // ✅ Redirect to dashboard
      router.push("/admin/dashboard");
    } catch (error : any) {
       toast.error(error.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* BACKGROUND */}
      <Image
        src="/assets/Bg-new.png"
        alt="background"
        fill
        priority
         className="absolute inset-0 object-cover opacity-60 -z-10"
      />

      {/* LOGIN CARD */}
      <div
        className="
          relative z-10
          w-full max-w-[630px] m-6
          rounded-[24px]
          backdrop-blur-md
          border-[5px] border-white
          shadow-[0_30px_80px_rgba(0,0,0,0.12)]
          px-4 xl:px-[55px] py-8 xl:py-[65px]
          bg-[linear-gradient(180deg,#f9f4e7_0%,#FFFFFF_30%)]
        "
      >
        {/* TITLE */}
        <h1 className="text-[32px] font-semibold text-center text-[#1A1A1A] mb-8">
          Admin Login
        </h1>

        {/* ================= FORM ================= */}
        <Formik<LoginFormValues>
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-5">
              {/* EMAIL */}
              <div>
                <label className="block text-lg font-medium text-gray mb-[10px]">
                  Email Address
                </label>

                <Field
                  name="email"
                  placeholder="Enter your email address"
                  className={`
                    w-full py-3 lg:py-5
                    rounded-[10px]
                    border px-4 text-sm
                    outline-none
                    ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-[#E0E0E0] focus:border-green"
                    }
                  `}
                />

                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-lg font-medium text-gray mb-[10px]">
                  Password
                </label>

                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    className={` w-full py-3 lg:py-5
      rounded-[10px]
      border px-4 pr-10 text-sm
      outline-none   ${
        errors.password && touched.password
          ? "border-red-500"
          : "border-[#E0E0E0] focus:border-green"
      }
    `}
                  />

                  {/* 👁 Eye Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <FiEyeOff className="cursor-pointer" />
                    ) : (
                      <FiEye className="cursor-pointer" />
                    )}
                  </button>
                </div>

                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full h-12 lg:h-[50px]
                  rounded-[12px]
                  bg-gray
                  text-white
                  font-semibold
                  text-[15px]
                  disabled:opacity-60 cursor-pointer
                "
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
