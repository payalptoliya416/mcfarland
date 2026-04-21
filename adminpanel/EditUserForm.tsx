"use client";

import { useEffect, useState } from "react";
import {  useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, useFormikContext } from "formik";
import { adminUserService } from "@/api/admin/usersManagement";
import { CountryPhoneInput } from "@/adminpanel/CountryPhoneInput";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";
import * as Yup from "yup";

type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  address: string;
  company_name: string;
  city: string;
  state: string;
  zip_code: string;
};

/* ================= PHONE FIELD ================= */
function PhoneField() {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<FormValues>();

  return (
    <div>
      <label className="block mb-3 text-sm font-medium text-lightblack">
        Phone Number
      </label>

      <div
        className={`rounded-[10px] border ${
          errors.phone && touched.phone
            ? "border-red-500"
            : "border-border"
        }`}
      >
        <CountryPhoneInput
          value={values.phone || ""}
          onChange={(val) => setFieldValue("phone", val)}
        />
      </div>

      {errors.phone && touched.phone && (
        <p className="text-xs text-red-500 mt-1">
          {errors.phone}
        </p>
      )}
    </div>
  );
}

/* ================= MAIN FORM ================= */
export default function EditUserForm() {
const searchParams = useSearchParams();
const id = searchParams.get("id");
const [loading, setLoading] = useState(true);
  const router = useRouter();
  const defaultInitialValues: FormValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    address: "",
    company_name: "",
    city: "",
    state: "",
    zip_code: "",
  };
  const [initialValues, setInitialValues] =
    useState<FormValues>(defaultInitialValues);
  /* ================= FETCH USER ================= */
useEffect(() => {
  if (!id) return;

  const fetchUser = async () => {
    try {
      setLoading(true);

      const res = await adminUserService.show(Number(id));
      const user = res.data; // ✅ FIX

      setInitialValues({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        phone: user.phone_no ?? "",
        password: "",
        confirm_password: "",
        address: user.address ?? "",
        company_name: user.company_name ?? "",
        city: user.city ?? "",
        state: user.state ?? "",
        zip_code: user.zip_code ?? "",
      });
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoading(false); // 🔥 loader off
    }
  };

  fetchUser();
}, [id]);

const getChangedFields = (
  values: FormValues,
  initial: FormValues
) => {
  const changed: Partial<FormValues> = {};

  (Object.keys(values) as (keyof FormValues)[]).forEach((key) => {
    if (values[key] !== initial[key] && values[key] !== "") {
      changed[key] = values[key];
    }
  });

  return changed;
};

const validationSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),

  email: Yup.string()
    .email("Enter valid email")
    .required("Email is required"),

  phone: Yup.string().required("Phone number is required"),

  address: Yup.string().required("Address is required"),

  company_name: Yup.string().required("Company name is required"),

  city: Yup.string().required("City is required"),

  state: Yup.string().required("State is required"),

  zip_code: Yup.string().required("Zip code is required"),

  password: Yup.string()
    .nullable()
    .test(
      "password-length",
      "Password must be at least 6 characters",
      (val) => !val || val.length >= 6
    ),

  confirm_password: Yup.string().when("password", {
    is: (val: string) => val && val.length > 0,
    then: (schema) =>
      schema
        .required("Confirm password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

  /* ================= SUBMIT ================= */
const handleSubmit = async (values: FormValues) => {
  try {
    await adminUserService.update(Number(id), {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone_no: values.phone,
      password: values.password || undefined,
      address: values.address,
      company_name: values.company_name,
      city: values.city,
      state: values.state,
      zip_code: values.zip_code,
    });

    toast.success("User updated successfully");
    router.back();
  } catch (error) {
    // toast.error("Update failed");
  }
};
if (loading) {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader />
    </div>
  );
}
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
        validationSchema={validationSchema}
      enableReinitialize
    >
      {({ errors, touched, setFieldValue, values, isSubmitting }) => (
        <Form className="space-y-8">
          {/* ================= BASIC INFO ================= */}
          <div className="rounded-2xl md:border border-[#ECECEC] bg-white p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block mb-3 text-sm font-medium text-lightblack">
                  First Name <span className="text-redmark">*</span>
                </label>
                 <Field
              name="first_name"
              placeholder="Enter first name"
              className={`
                w-full px-5 py-4 rounded-[10px] border
                focus:outline-none
                ${
                  errors.first_name && touched.first_name
                    ? "border-red-500"
                    : "border-border"
                }
              `}
            />
                            {errors.first_name && touched.first_name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.first_name}
              </p>
            )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block mb-3 text-sm font-medium text-lightblack">
                  Last Name <span className="text-redmark">*</span>
                </label>
                <Field
                name="last_name"
                  placeholder="Enter last name"
                  className={`w-full px-5 py-4 rounded-[10px] border focus:outline-none
                    ${errors.last_name && touched.last_name ? "border-red-500" : "border-border"}
                  `}
                />
                {errors.last_name && touched.last_name && (
                  <p className="text-xs text-red-500 mt-1">{errors.last_name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-3 text-sm font-medium text-lightblack">
                  Email Address <span className="text-redmark">*</span>
                </label>
               <Field
                name="email"
                type="email"
                placeholder="Enter email"
                className={`
                  w-full px-5 py-4 rounded-[10px] border focus:outline-none
                  ${errors.email && touched.email ? "border-red-500" : "border-border"}
                `}
              />

              {errors.email && touched.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email}
                </p>
              )}
              </div>

              {/* Phone */}
              <PhoneField />

              {/* Password */}
              <div>
                <label className="block mb-3 text-sm font-medium text-lightblack">
                  Password <span className="text-redmark">*</span>
                </label>
                              <Field
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  className={`w-full px-5 py-4 rounded-[10px] border focus:outline-none
                    ${errors.password && touched.password ? "border-red-500" : "border-border"}
                  `}
                />
                {errors.password && touched.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-3 text-sm font-medium text-lightblack">
                  Confirm Password <span className="text-redmark">*</span>
                </label>
            <Field
  name="confirm_password"
  type="password"
  placeholder="Confirm password"
  className={`w-full px-5 py-4 rounded-[10px] border focus:outline-none
    ${errors.confirm_password && touched.confirm_password ? "border-red-500" : "border-border"}
  `}
/>
{errors.confirm_password && touched.confirm_password && (
  <p className="text-xs text-red-500 mt-1">{errors.confirm_password}</p>
)}
              </div>
            </div>
          </div>

          {/* ================= ADDRESS ================= */}
          <div className="rounded-2xl md:border border-[#ECECEC] bg-white p-5 space-y-5">
            {/* Address */}
            <div>
              <label className="block mb-3 text-sm font-medium text-lightblack">
                Address <span className="text-redmark">*</span>
              </label>
             <Field
          name="address"
          placeholder="Enter address"
          className={`w-full px-5 py-4 rounded-[10px] border focus:outline-none
            ${errors.address && touched.address ? "border-red-500" : "border-border"}
          `}
        />
        {errors.address && touched.address && (
          <p className="text-xs text-red-500 mt-1">{errors.address}</p>
        )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Company */}
              <div>
                <label className="block mb-3 text-sm font-medium text-lightblack">
                  Company Name <span className="text-redmark">*</span>
                </label>
                <Field
                  name="company_name"
                  placeholder="Company name"
                  className={`w-full px-5 py-4 rounded-[10px] border focus:outline-none
                    ${errors.company_name && touched.company_name ? "border-red-500" : "border-border"}
                  `}
                />
                {errors.company_name && touched.company_name && (
                  <p className="text-xs text-red-500 mt-1">{errors.company_name}</p>
                )}

              </div>

              {/* City */}
              <div>
                <label className="block mb-3 text-sm font-medium text-lightblack">
                  City <span className="text-redmark">*</span>
                </label>
                <Field
                  name="city"
                  placeholder="City"
                  className={`w-full px-5 py-4 rounded-[10px] border focus:outline-none
                    ${errors.city && touched.city ? "border-red-500" : "border-border"}
                  `}
                />
                {errors.city && touched.city && (
                  <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block mb-3 text-sm font-medium text-lightblack">
                  State <span className="text-redmark">*</span>
                </label>
                 <Field
              name="state"
              placeholder="State"
              className={`w-full px-5 py-4 rounded-[10px] border focus:outline-none
                ${errors.state && touched.state ? "border-red-500" : "border-border"}
              `}
            />
            {errors.state && touched.state && (
              <p className="text-xs text-red-500 mt-1">{errors.state}</p>
            )}
              </div>

              {/* Zip */}
              <div>
                <label className="block mb-3 text-sm font-medium text-lightblack">
                  Zip Code <span className="text-redmark">*</span>
                </label>
                <Field
                name="zip_code"
                placeholder="Zip code"
                className={`w-full px-5 py-4 rounded-[10px] border focus:outline-none
                  ${errors.zip_code && touched.zip_code ? "border-red-500" : "border-border"}
                `}
              />
              {errors.zip_code && touched.zip_code && (
                <p className="text-xs text-red-500 mt-1">{errors.zip_code}</p>
              )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2 rounded-lg border text-sm text-gray-600 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-[#FFAD01] text-white text-sm font-medium cursor-pointer"
              >
                Update User
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
