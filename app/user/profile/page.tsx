"use client";

import Image from "next/image";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
  UserProfile,
  UserProfileFormValues,
} from "@/api/user/profile";
import Loader from "@/components/common/Loader";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getLicenseStatus, uploadLicense, uploadLicenseData } from "@/api/user/license";
import toast from "react-hot-toast";
import { MdInfo } from "react-icons/md";
import { UploadBox } from "@/components/inventory/UploadBox";
import { getCountryFromAddress } from "@/api/geoapify";

/* ================= VALIDATION ================= */
const schema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  company: Yup.string().required("Company name is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zip: Yup.string().required("Zip code is required"),
});

/* ================= COMPONENT ========== ======= */
export default function UserProfileForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
    const [country, setCountry] = useState<string | null>(null);
  /* ================= API CALL ================= */
  useEffect(() => {
    const loadProfileAndCountry = async () => {
      const res = await getUserProfile();
      if (!res.status) return;

      setProfile(res.data);

      try {
        const geo = await getCountryFromAddress(
          res.data.address,
          res.data.city,
          res.data.state,
          res.data.zip_code,
        );

        if (!geo?.country_code) {
          setCountry("USA");
          return;
        }

        setCountry(geo.country_code);
      } catch (err) {
        setCountry("USA");
      }
    };

    loadProfileAndCountry();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile();
      if (res.status) {
        setProfile(res.data);
      }
    } catch (error) {
      console.error("Profile fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile().finally(() => setLoading(false));
  }, []);

  const handleProfileUpdate = async (values: UserProfileFormValues) => {
    try {
      setSaving(true);
      const res = await updateUserProfile(values);
      if (res.status) {
        toast.success(res.message || "Profile updated successfully"); // ✅ SUCCESS
        await fetchProfile();
      } else {
        toast.error(res.message || "Profile update failed");
      }
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }
  if (!profile) return null;

  const canUploadLicense =
    profile.license_status === "Unverified" ||
    profile.license_status === "Declined";

  const initialValues: UserProfileFormValues = {
    firstName: profile.first_name,
    lastName: profile.last_name,
    email: profile.email,
    phone: profile.phone_no,
    address: profile.address,
    company: profile.company_name,
    city: profile.city,
    state: profile.state,
    zip: profile.zip_code,
  };

  const LICENSE_STATUS_CONFIG = {
    Unverified: {
      label: "Unverified",
      bg: "bg-[#3C97FF] text-white",
      icon: "/assets/p3.svg",
    },

    Pending: {
      label: "Pending",
      bg: "bg-[#F6C343] text-gray",
      icon: "/assets/p4.svg",
    },

    Verified: {
      label: "Verified",
      bg: "bg-[#2DBE60]  text-white",
      icon: "/assets/p1.svg",
    },

    Declined: {
      label: "Declined",
      bg: "bg-[#E53935]  text-white",
      icon: "/assets/p2.svg",
    },
  } as const;

  const licenseStatusMap: Record<number, keyof typeof LICENSE_STATUS_CONFIG> = {
    0: "Unverified",
    1: "Pending",
    2: "Verified",
    3: "Declined",
  };

  const statusKey =
    (profile?.license_status as keyof typeof LICENSE_STATUS_CONFIG) ||
    "Unverified";

  const statusConfig = LICENSE_STATUS_CONFIG[statusKey];

  const handleFileSelect =
    (setter: (file: File | null) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, PNG, JPG, JPEG allowed");
        e.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File must be under 5MB");
        e.target.value = "";
        return;
      }

      setter(file);
    };

  const getLicenseMessageConfig = (isLicense: number) => {
    switch (isLicense) {
      case 0: // Pending
        return {
          type: "pending",
          bg: "bg-[#FFF8E6] border border-[#FFE1A3] text-[#A26A00]",
          message:
            "Your license is under verification. Please wait while we review your document.",
        };

      case 1: // Verified
        return {
          type: "verified",
          bg: "bg-[#E8F8EE] border border-[#BFE8D1] text-[#2E7D32]",
          message:
            "Your license has been verified successfully. You can now complete purchases.",
        };

      case 2: // Declined
        return {
          type: "declined",
          bg: "bg-[#FFECEC] border border-[#FFBABA] text-[#D32F2F]",
          message:
            "Your license could not be verified. Please review the details and resubmit.",
        };

      default:
        return {
          type: "unverified",
          bg: "bg-[#F2F2F2] border border-[#E0E0E0] text-[#616161]",
          message: "Please upload your license document for verification.",
        };
    }
  };

  const LicenseStatusBadge = ({ status }: { status: string }) => {
    const config =
      LICENSE_STATUS_CONFIG[status as keyof typeof LICENSE_STATUS_CONFIG] ||
      LICENSE_STATUS_CONFIG.Unverified;

    return (
      <span
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${config.bg}`}
      >
        <Image src={config.icon} alt={config.label} width={14} height={14} />
        {config.label}
      </span>
    );
  };

  const submitLicenseToNewAPI = async () => {
    if (!frontFile || !backFile) {
      toast.error("Please upload both front & back side");
      return;
    }

    try {
      setUploading(true);

     const formData = new FormData();
formData.append("front", frontFile);

if (backFile) {
  formData.append("back", backFile);
}

formData.append("docType", "DRIVERS");

if (country) {
  formData.append("country", country);
}

const res = await uploadLicense(formData);

      if (!res?.status) {
        toast.error(res?.message || "License upload failed");
        return;
      }

      toast.success("License uploaded successfully");

      setFrontFile(null);
      setBackFile(null);

      if (profile) {
        setProfile({
          ...profile,
          license_status: "Pending",
          is_license: 1,
        });
      }

      fetchProfile().catch((err) => {
        console.error("Background profile fetch failed:", err);
      });

      setUploading(false);
      setVerifying(true);

      await new Promise((resolve) => setTimeout(resolve, 30000));

      await getLicenseStatus();
    } catch (err) {
      console.error("License upload error:", err);
      toast.error("Something went wrong while uploading license");
    } finally {
      setUploading(false);
      setVerifying(false);
    }
  };

  return (
    <section className="py-10">
      <div className="container-custom mx-auto space-y-5">
        {/* ================= PAGE TITLE ================= */}
        <h1 className="text-xl font-semibold text-secgray">Profile</h1>

        {/* ================= PROFILE CARD ================= */}
        <div className="border border-border rounded-xl overflow-hidden bg-white">
          {/* TOP GRADIENT */}
          <div className="h-[120px] bg-gradient-to-r from-[#9FF5D2] via-[#CFF7E5] to-[#F4F9CC]" />

          {/* PROFILE INFO */}
          <div className="flex items-center justify-between px-6 pb-6 -mt-7 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className={`w-[142px] h-[142px] rounded-full flex items-center justify-center
              text-white text-4xl font-semibold border-4 border-white
              ${statusConfig.bg.split(" ")[0]}`}
                >
                  {profile?.first_name?.charAt(0)}
                  {profile?.last_name?.charAt(0)}
                </div>

                <span
                  className={`border-2 border-white absolute bottom-3 right-2
              w-6 h-6 rounded-full flex items-center justify-center
              ${statusConfig.bg}`}
                >
                  <img
                    src={statusConfig.icon}
                    alt={statusConfig.label}
                    className="w-3 h-3"
                  />
                </span>
              </div>

              <div>
                <p className="font-medium text-secgray">
                  {" "}
                  {profile.first_name} {profile.last_name}
                </p>
                <p className="text-sm text-seclightgray"> {profile.email}</p>
              </div>
            </div>

            {/* STATUS */}
            <LicenseStatusBadge status={profile.license_status} />
          </div>
          {verifying && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl text-center shadow-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange border-t-transparent mx-auto mb-4"></div>
                <p className="text-lg font-semibold">
                  Verifying your license...
                </p>
              </div>
            </div>
          )}
          {/* ================= FORM ================= */}
          <div className="px-6 pb-6">
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={schema}
              onSubmit={handleProfileUpdate}
            >
              {({ errors, touched, values, setFieldValue }: any) => (
                <Form className="space-y-5">
                  {/* NAME */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="input-label">First Name</label>
                      <Field name="firstName" className="input-class" />
                      {errors.firstName && touched.firstName && (
                        <p className="error">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="input-label">Last Name</label>
                      <Field name="lastName" className="input-class" />
                      {errors.lastName && touched.lastName && (
                        <p className="error">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* EMAIL / PHONE */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="input-label">Email Address</label>
                      <Field name="email" className="input-class" />
                    </div>

                    <div>
                      <label className="input-label">Phone Number</label>

                      <PhoneInput
                        country="in"
                        value={values.phone}
                        onChange={(phone) => setFieldValue("phone", phone)}
                        enableSearch
                        countryCodeEditable={false}
                        /* MAIN CONTAINER */
                        containerClass="!w-full"
                        /* INPUT FIELD */
                        inputClass="
                            !w-full
                            !h-[51px]
                            !pl-[60px]
                            !pr-5
                            !rounded-[10px]
                            !border
                            !border-border
                            !text-sm
                            focus:!outline-none
                          "
                        /* FLAG BUTTON */
                        buttonClass="
                            !border
                            !border-border
                            !rounded-l-[10px]
                            !h-[51px]
                            !w-[52px]
                            !flex
                            !items-center
                            !justify-center
                          "
                        dropdownClass="!text-sm"
                        placeholder="(000) 000-0000"
                      />
                      {errors.phone && touched.phone && (
                        <p className="error">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div>
                    <label className="input-label">Address</label>
                    <Field name="address" className="input-class" />
                    {errors.address && touched.address && (
                      <p className="error">{errors.address}</p>
                    )}
                  </div>

                  {/* COMPANY */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div>
                      <label className="input-label">Company Name</label>
                      <Field name="company" className="input-class" />
                      {errors.company && touched.company && (
                        <p className="error">{errors.company}</p>
                      )}
                    </div>

                    <div>
                      <label className="input-label">City</label>
                      <Field name="city" className="input-class" />
                      {errors.city && touched.city && (
                        <p className="error">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="input-label">State</label>
                      <Field
                        type="text"
                        name="state"
                        className="input-class"
                        placeholder="Enter state"
                      />
                      {errors.state && touched.state && (
                        <p className="error">{errors.state}</p>
                      )}
                    </div>
                    <div className="">
                      <label className="input-label">Zip Code</label>
                      <Field name="zip" className="input-class" />
                    </div>
                  </div>

                  {/* ZIP */}
                  {/* ================= LICENSE VERIFY ================= */}
                  <div className="border border-border rounded-xl p-5">
                    <h3 className="text-sm font-medium text-secgray mb-4">
                      License Verify
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                      {/* LEFT SIDE */}
                      <div className="border border-border rounded-xl p-4">
                        {canUploadLicense ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <UploadBox
                              label="Upload the front of your Driver’s License"
                              file={frontFile}
                              onChange={setFrontFile}
                            />

                            <UploadBox
                              label="Upload the back of your Driver’s License"
                              file={backFile}
                              onChange={setBackFile}
                            />
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-[#E0E0E0] rounded-lg py-10 px-6 text-center text-sm text-gray-400">
                            License upload is disabled while verification is in
                            progress or completed.
                          </div>
                        )}
                      </div>
                      {/* RIGHT SIDE MESSAGE */}
                      {(() => {
                        const config = getLicenseMessageConfig(
                          profile.is_license,
                        );

                        return (
                          <div
                            className={`flex items-center gap-3 p-4 rounded-lg text-sm ${config.bg}`}
                          >
                            <span className="mt-[2px]">
                              <MdInfo size={18} />
                            </span>
                            <p>{config.message}</p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg border cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={submitLicenseToNewAPI}
                      disabled={
                        !canUploadLicense ||
                        uploading ||
                        verifying ||
                        !frontFile ||
                        !backFile
                      }
                      className={`px-6 py-3 rounded-lg text-white cursor-pointer ${
                        !canUploadLicense ||
                        uploading ||
                        !frontFile ||
                        !backFile
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green"
                      }`}
                    >
                      {uploading
                        ? "Uploading..."
                        : verifying
                          ? "Verifying..."
                          : "Upload License"}
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className={`px-6 py-3 rounded-lg text-white bg-green cursor-pointer ${
                        saving ? "bg-gray-400 cursor-not-allowed" : "bg-green"
                      }`}
                    >
                      {saving ? "Saving..." : "Save Change"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
}
