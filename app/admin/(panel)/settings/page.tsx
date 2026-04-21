"use client";

import { Formik, Form, Field } from "formik";
import PhoneInput from "react-phone-input-2";
import * as Yup from "yup";
import "react-phone-input-2/lib/style.css";
import { FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";
import {
  AdminSettingsData,
  adminSettingsService,
  adminSettingsUpdateService,
} from "@/api/admin/settings";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";
import QuillEditor from "@/adminpanel/QuillEditor";

type SettingsFormValues = {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  perMile: string | number;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  whiteLogo: File | null;
  darkLogo: File | null;
  bank_name: string;
  beneficiary_name: string;
  beneficiary_address: string;
  account_number: string;
  routing_number: string;
  branch_address: string;
};

/* ---------------- VALIDATION ---------------- */
export const Schema = Yup.object({
  companyName: Yup.string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .required("Company name is required"),

  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email address is required"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Enter 10 digit phone number"),

  address: Yup.string()
    .min(5, "Address must be at least 5 characters")
    .required("Address is required"),

  perMile: Yup.number()
    .typeError("Delivery cost must be a number")
    .positive("Delivery cost must be greater than 0")
    .required("Per mile delivery cost is required"),
  bank_name: Yup.string().required("Bank name is required"),
  beneficiary_name: Yup.string().required("Beneficiary name is required"),
  beneficiary_address: Yup.string().required("Beneficiary address is required"),
  account_number: Yup.string().required("Account number is required"),
  routing_number: Yup.string().required("Routing number is required"),
  branch_address: Yup.string().required("Branch address is required"),
  facebook: Yup.string()
    .url("Enter a valid Twitter URL")
    .required("Facebook link is required"),
  //   facebook: Yup.string()
  //   .matches(/^https?:\/\/(www\.)?facebook\.com\/.+$/, "Enter valid Facebook profile URL")
  //   .required("Facebook link is required"),

  twitter: Yup.string()
    .url("Enter a valid Twitter URL")
    .required("Twitter link is required"),

  instagram: Yup.string()
    .url("Enter a valid Instagram URL")
    .required("Instagram link is required"),

  linkedin: Yup.string()
    .url("Enter a valid LinkedIn URL")
    .required("LinkedIn link is required"),
});

export default function CompanySettingUI() {
  const [data, setData] = useState<AdminSettingsData | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  /* ================= API FETCH ================= */
  const fetchSettings = async () => {
    try {
      const res = await adminSettingsService();
      if (res.success) {
        setData(res.data);
        setWhiteLogoPreview(res.data.white_logo);
        setDarkLogoPreview(res.data.dark_logo);
      }
    } catch (e) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);
  const [whiteLogoPreview, setWhiteLogoPreview] = useState<string | null>(null);
  const [darkLogoPreview, setDarkLogoPreview] = useState<string | null>(null);

  const initialValues: SettingsFormValues = {
    companyName: data?.company_name || "",
    email: data?.email || "",
    phone: data?.phone_no || "",
    address: data?.address || "" || "",
    perMile: data?.per_mile_delivery_cost || "",
    facebook: data?.facebook || "",
    twitter: data?.twitter || "",
    instagram: data?.instagram || "",
    linkedin: data?.linkedin || "",
    whiteLogo: null,
    darkLogo: null,
    bank_name: data?.bank_name || "",
    beneficiary_name: data?.beneficiary_name || "",
    beneficiary_address: data?.beneficiary_address || "",
    account_number: data?.account_number || "",
    routing_number: data?.routing_number || "",
    branch_address: data?.branch_address || "",
  };

  const handleSubmit = async (
    values: SettingsFormValues,
    { setSubmitting }: { setSubmitting: (v: boolean) => void },
  ) => {
    try {
      const formData = new FormData();

      formData.append("company_name", values.companyName);
      formData.append("email", values.email);
      formData.append("phone_no", values.phone);
      formData.append("address", values.address);
      formData.append("per_mile_delivery_cost", String(values.perMile));
      formData.append("facebook", values.facebook);
      formData.append("twitter", values.twitter);
      formData.append("instagram", values.instagram);
      formData.append("linkedin", values.linkedin);
      formData.append("bank_name", values.bank_name);
      formData.append("beneficiary_name", values.beneficiary_name);
      formData.append("beneficiary_address", values.beneficiary_address);
      formData.append("account_number", values.account_number);
      formData.append("routing_number", values.routing_number);
      formData.append("branch_address", values.branch_address);

      if (values.whiteLogo) {
        formData.append("white_logo", values.whiteLogo);
      }

      if (values.darkLogo) {
        formData.append("dark_logo", values.darkLogo);
      }

      const res = await adminSettingsUpdateService(formData);

      if (res.success) {
        toast.success(res.message || "Settings updated successfully");
        await fetchSettings();
      }
    } catch (e) {
      toast.error("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (!data) return null;

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        touched,
        values,
        setFieldValue,
        isSubmitting,
        resetForm,
        dirty,
      }) => (
        <Form className="space-y-5 ">
          {/* ================= TOP CARD ================= */}
          <div className="border border-border rounded-[14px] bg-white p-3 sm:p-5">
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="h-[175px] border border-border rounded-xl p-5">
                <div
                  className="relative rounded-xl border border-[#4A8D86] h-full flex items-center justify-center"
                  style={{
                    backgroundImage: whiteLogoPreview
                      ? `url(${whiteLogoPreview})`
                      : "none",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <label className="absolute bg-white px-4 py-2 rounded-md shadow cursor-pointer text-sm">
                    Upload White Logo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setFieldValue("whiteLogo", file);
                        setWhiteLogoPreview(URL.createObjectURL(file));
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* LOGO */}
              <div className="h-[175px] border border-border rounded-xl p-5">
                <div
                  className="relative rounded-xl border border-[#4A8D86] h-full flex items-center justify-center"
                  style={{
                    backgroundImage: darkLogoPreview
                      ? `url(${darkLogoPreview})`
                      : "none",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <label className="absolute bg-white px-4 py-2 rounded-md shadow cursor-pointer text-sm">
                    Upload Dark Logo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setFieldValue("darkLogo", file);
                        setDarkLogoPreview(URL.createObjectURL(file));
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* COMPANY NAME */}
              <div>
                <label className="block mb-3 text-base font-normal text-lightblack">
                  Footer Company Name <span className="text-redmark">*</span>
                </label>
                <Field
                  name="companyName"
                  placeholder="Enter footer company name"
                  className="w-full px-5 py-4 rounded-[10px] border border-border focus:outline-none"
                />
                {errors.companyName && touched.companyName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="block mb-3 text-base font-normal text-lightblack">
                  Email Address <span className="text-redmark">*</span>
                </label>
                <Field
                  name="email"
                  placeholder="Enter your email address"
                  className="w-full px-5 py-4 rounded-[10px] border border-border focus:outline-none"
                />
                {errors.email && touched.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
              {/* PHONE */}
              <div>
                <label className="block mb-3 text-base font-normal text-lightblack">
                  Phone Number <span className="text-redmark">*</span>
                </label>

                <Field
                  name="phone"
                  placeholder="Enter phone number"
                  maxLength={10}
                  className="w-full px-5 py-4 rounded-[10px] border border-border"
                />
                {errors.phone && touched.phone && (
                  <p className="error">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block mb-3 text-base font-normal text-lightblack">
                  Address <span className="text-redmark">*</span>
                </label>
                <Field
                  name="address"
                  placeholder="Enter address"
                  className="w-full px-5 py-4 rounded-[10px] border border-border focus:outline-none"
                />
                {errors.address && touched.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* ================= DELIVERY ================= */}
          <div className="border border-border rounded-[14px] bg-white p-3 sm:p-5">
            <label className="block mb-3 text-base font-normal text-lightblack">
              Per Miles Delivery Cost <span className="text-redmark">*</span>
            </label>
            <div className="relative">
              <Field
                name="perMile"
                placeholder="Enter delivery cost"
                className="w-full px-5 py-4 rounded-[10px] border border-border focus:outline-none"
              />
              <span className="absolute right-4 top-5 text-sm text-gray-400">
                / Per miles
              </span>
            </div>
            {errors.perMile && touched.perMile && (
              <p className="text-xs text-red-500 mt-1">{errors.perMile}</p>
            )}
          </div>

          {/* ============= */}
          <div className="border border-border rounded-[14px] bg-white p-3 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Bank Name */}
              <div>
                <label className="block mb-3 text-base font-normal text-lightblack">
                  Bank Name <span className="text-redmark">*</span>
                </label>
                <Field
                  name="bank_name"
                  placeholder="Enter bank name"
                  className="w-full px-5 py-4 rounded-[10px] border border-border"
                />
                {errors.bank_name && touched.bank_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.bank_name}
                  </p>
                )}
              </div>

              {/* Beneficiary Name */}
              <div>
                <label className="block mb-3 text-base font-normal text-lightblack">
                  Beneficiary Name <span className="text-redmark">*</span>
                </label>
                <Field
                  name="beneficiary_name"
                  placeholder="Enter beneficiary name"
                  className="w-full px-5 py-4 rounded-[10px] border border-border"
                />
                {errors.beneficiary_name && touched.beneficiary_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.beneficiary_name}
                  </p>
                )}
              </div>

              {/* Beneficiary Address */}
              <div className="md:col-span-2">
                <label className="block mb-3 text-base font-normal text-lightblack">
                  Beneficiary Address <span className="text-redmark">*</span>
                </label>
                <Field
                  name="beneficiary_address"
                  placeholder="Enter beneficiary address"
                  className="w-full px-5 py-4 rounded-[10px] border border-border"
                />
                {errors.beneficiary_address && touched.beneficiary_address && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.beneficiary_address}
                  </p>
                )}
              </div>

              {/* Account Number */}
              <div>
                <label className="block mb-3 text-base font-normal text-lightblack">
                  Account Number <span className="text-redmark">*</span>
                </label>
                <Field
                  name="account_number"
                  placeholder="Enter account number"
                  className="w-full px-5 py-4 rounded-[10px] border border-border"
                />
                {errors.account_number && touched.account_number && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.account_number}
                  </p>
                )}
              </div>

              {/* Routing Number */}
              <div>
                <label className="block mb-3 text-base font-normal text-lightblack">
                  Routing Number <span className="text-redmark">*</span>
                </label>
                <Field
                  name="routing_number"
                  placeholder="Enter routing number"
                  className="w-full px-5 py-4 rounded-[10px] border border-border"
                />
                {errors.routing_number && touched.routing_number && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.routing_number}
                  </p>
                )}
              </div>

              {/* Branch Address */}
              <div className="md:col-span-2">
                <label className="block mb-3 text-base font-normal text-lightblack">
                  Branch Address <span className="text-redmark">*</span>
                </label>
                <Field
                  name="branch_address"
                  placeholder="Enter branch address"
                  className="w-full px-5 py-4 rounded-[10px] border border-border"
                />
                {errors.branch_address && touched.branch_address && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.branch_address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ================= SOCIAL ================= */}
          <div className="border border-border rounded-[14px] bg-white p-3 sm:p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* FACEBOOK */}
              <div>
                <label className="block mb-3 text-base font-normal text-lightblack">
                  Facebook <span className="text-redmark">*</span>
                </label>
                <Field
                  name="facebook"
                  placeholder="https://www.facebook.com/"
                  className="w-full px-5 py-4 rounded-[10px] border border-border  focus:outline-none"
                />
                {errors.facebook && touched.facebook && (
                  <p className="text-xs text-red-500 mt-1">{errors.facebook}</p>
                )}
              </div>

              {/* TWITTER */}
              <div>
                <label className="block mb-3 text-base font-normal text-lightblack">
                  Twitter <span className="text-redmark">*</span>
                </label>
                <Field
                  name="twitter"
                  placeholder="https://www.twitter.com/"
                  className="w-full px-5 py-4 rounded-[10px] border border-border  focus:outline-none"
                />
                {errors.twitter && touched.twitter && (
                  <p className="text-xs text-red-500 mt-1">{errors.twitter}</p>
                )}
              </div>

              {/* INSTAGRAM */}
              <div>
                <label className="block mb-3 text-base font-normal text-lightblack">
                  Instagram <span className="text-redmark">*</span>
                </label>
                <Field
                  name="instagram"
                  placeholder="https://www.instagram.com/"
                  className="w-full px-5 py-4 rounded-[10px] border border-border  focus:outline-none"
                />
                {errors.instagram && touched.instagram && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.instagram}
                  </p>
                )}
              </div>

              {/* LINKEDIN */}
              <div>
                <label className="block mb-3 text-base font-normal text-lightblack">
                  Linkedin <span className="text-redmark">*</span>
                </label>
                <Field
                  name="linkedin"
                  placeholder="https://www.linkedin.com/"
                  className="w-full px-5 py-4 rounded-[10px] border border-border  focus:outline-none"
                />
                {errors.linkedin && touched.linkedin && (
                  <p className="text-xs text-red-500 mt-1">{errors.linkedin}</p>
                )}
              </div>
            </div>
            {/* ================= ACTIONS ================= */}
            <div className="flex justify-end gap-3">
              {/* CANCEL */}
              <button
                type="button"
                disabled={isSubmitting || cancelLoading}
                onClick={async () => {
                  if (!dirty) {
                    toast("No changes to discard");
                    return;
                  }

                  try {
                    setCancelLoading(true);
                    await fetchSettings();
                    resetForm();
                    toast.success("Changes discarded");
                  } finally {
                    setCancelLoading(false);
                  }
                }}
                className="px-6 py-2 border border-border rounded-md text-sm text-gray-500 flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {/* 🔥 CANCEL LOADER */}
                {cancelLoading && (
                  <span className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                )}
                {cancelLoading ? "Discarding..." : "Cancel"}
              </button>

              {/* SAVE */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-md bg-[#FFBD34] text-white text-sm flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting && (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                Save
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
