"use client";

import { clearAdminToken, getAdminUser } from "@/api/admin/adminAuth";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  HiArrowPath,
  HiOutlineBars3,
  HiOutlineBellAlert,
} from "react-icons/hi2";
import { IoChevronDown, IoClose } from "react-icons/io5";
import { FiChevronRight, FiEye, FiEyeOff } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { adminSettingsService } from "@/api/admin/bidding";

/* ================= TYPES ================= */
type AdminUser = {
  name: string;
  email: string;
};

/* ================= COMPONENT ================= */
export default function AdminHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const segments = pathname.replace("/admin", "").split("/").filter(Boolean);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const showBreadcrumb = segments.length > 1;
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [menuLoading, setMenuLoading] = useState<string | null>(null);
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Current password is required"),

      newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)/,
          "Must contain at least one letter and one number",
        )
        .required("New password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        setApiError(null);
        setApiSuccess(null);

        const res = await adminSettingsService.changePassword({
          current_password: values.currentPassword,
          new_password: values.newPassword,
          confirm_password: values.confirmPassword,
        });

        if (res.success) {
          setApiSuccess(res.message || "Password updated successfully");
          resetForm();

          setTimeout(() => {
            setShowChangePassword(false);
            setApiSuccess(null);
          }, 1500);
        } else {
          setApiError(res.message || "Something went wrong");
        }
      } catch (error: any) {
        setApiError(error?.message || "Server error");
      } finally {
        setLoading(false);
      }
    },
  });

  const [user, setUser] = useState<AdminUser | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setUser(getAdminUser());
  }, []);

  const handleLogout = () => {
    clearAdminToken();
    router.push("/admin");
  };

  const handleMenuNavigate = (path: string, key: string) => {
    const normalize = (url: string) =>
      url.endsWith("/") ? url.slice(0, -1) : url;

    const current = normalize(pathname);
    const target = normalize(path);

    if (current === target) {
      setOpen(false);
      return;
    }

    setMenuLoading(key);
    router.push(path);
  };

  useEffect(() => {
    if (menuLoading) {
      setMenuLoading(null);
      setOpen(false);
    }
  }, [pathname]);
  const handleBreadcrumbNavigate = (path: string) => {
    const normalize = (url: string) =>
      url.endsWith("/") ? url.slice(0, -1) : url;

    const current = normalize(pathname);
    const target = normalize(path);

    if (current === target) return;

    setMenuLoading("breadcrumb");
    router.push(path);
  };
  return (
    <>
      <header className="bg-white flex items-center justify-between border rounded-[14px] border-border p-3 sm:p-5 mb-5">
        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden border border-border rounded-md p-2"
          >
            <HiOutlineBars3 size={22} />
          </button>

          <div className="min-w-0">
            <h1 className="text-lg font-semibold truncate whitespace-nowrap">
              {segments[0]
                ? segments[0]
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                : "Dashboard"}
            </h1>
            {showBreadcrumb && (
              <p className="text-sm text-[#8C8C8C] block max-w-full truncate whitespace-nowrap">
                {segments.map((seg, idx) => {
                  const label =
                    seg === "add" && id
                      ? "Update"
                      : seg
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase());

                  return (
                    <span key={idx} className="inline-flex items-center">
                      {idx === 0 ? (
                        <span
                          onClick={() =>
                            handleBreadcrumbNavigate("/admin/" + seg)
                          }
                          className="cursor-pointer hover:text-[#FFAD01] font-medium flex items-center gap-1"
                        >
                          {label}

                          {menuLoading === "breadcrumb" && (
                            <HiArrowPath size={12} className="animate-spin" />
                          )}
                        </span>
                      ) : (
                        <span>{label}</span>
                      )}

                      {idx < segments.length - 1 && (
                        <FiChevronRight
                          className="mx-1 text-[#8C8C8C]"
                          size={14}
                        />
                      )}
                    </span>
                  );
                })}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1 sm:gap-[15px] shrink-0">
          {/* Notification */}
          <button className="h-[42px] w-[42px] border border-border rounded-full flex items-center justify-center">
            <HiOutlineBellAlert size={20} className="text-para" />
          </button>

          {/* Profile */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="bg-white rounded-full px-1 py-[4px]
    flex items-center gap-3 shadow-sm md:pe-3 cursor-pointer
    border border-border"
            >
              <Image
                src="/assets/user.png"
                width={36}
                height={36}
                alt="user"
                className="rounded-full"
              />

              <span className="text-para font-medium text-[16px] hidden md:block">
                {user?.name || "Admin"}
              </span>

              <IoChevronDown
                size={18}
                className="text-gray-600 hidden md:block"
              />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl
        shadow-lg py-2 z-50 border border-gray-100"
                >
                  <button
                    disabled={menuLoading === "settings"}
                    onClick={() =>
                      handleMenuNavigate("/admin/settings", "settings")
                    }
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between cursor-pointer"
                  >
                    <span
                      className={`${
                        menuLoading === "settings" ? "text-gray-400" : ""
                      }`}
                    >
                      Settings
                    </span>

                    {menuLoading === "settings" && (
                      <HiArrowPath
                        size={14}
                        className="animate-spin text-gray-500"
                      />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setOpen(false);
                      setShowChangePassword(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm
          hover:bg-gray-100 cursor-pointer"
                  >
                    Change Password
                  </button>

                  <div className="border-t my-1" />

                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600
          hover:bg-red-50 cursor-pointer"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowChangePassword(false)}
              className="absolute top-4 right-4 w-6 h-6 rounded-full border
        flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer"
            >
              <IoClose />
            </button>

            <h2 className="text-xl font-semibold text-center mb-6">
              Change Password
            </h2>
            <form onSubmit={formik.handleSubmit}>
              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    name="currentPassword"
                    placeholder="Current Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.currentPassword}
                    className={`input
                        ${
                          formik.touched.currentPassword &&
                          formik.errors.currentPassword
                            ? "border-red-500 focus:ring-red-200"
                            : ""
                        }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  >
                    {showCurrent ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {formik.touched.currentPassword &&
                  formik.errors.currentPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.currentPassword}
                    </p>
                  )}
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    placeholder="New Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                    className={`input
                    ${
                      formik.touched.newPassword && formik.errors.newPassword
                        ? "border-red-500 focus:ring-red-200"
                        : ""
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  >
                    {showNew ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    className={`input
                  ${
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? "border-red-500 focus:ring-red-200"
                      : ""
                  }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  >
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>
              {apiError && (
                <p className="text-red-500 text-sm mb-3">{apiError}</p>
              )}

              {apiSuccess && (
                <p className="text-green-600 text-sm mb-3">{apiSuccess}</p>
              )}
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#FFAD01] text-white py-2 rounded-full font-medium hover:opacity-90 transition cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
