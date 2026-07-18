"use client";

import { JSX, useEffect, useState } from "react";
import {
  getSettingsByKeysFooter,
  sendContactEmail,
} from "@/api/categoryActions";
import Image from "next/image";

export default function ContactForm(): JSX.Element {

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSettingsByKeysFooter().then((res) => {
      if (res.success) {
        setSettings(res.data);
      }
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await sendContactEmail(formData);
      // ✅ SUCCESS from API
      if (res?.success) {
        setSuccessMsg(res.message || "Form submitted successfully.");

        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          message: "",
        });
      }
      // ❌ API responded but success = false
      else {
        setErrorMsg(res?.message || "Something went wrong. Please try again.");
      }
    } catch (error: any) {
      // ❌ API / Network / Server error
      setErrorMsg(error?.message || "Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className="container-custom"
      >
        <div className="relative overflow-hidden rounded-[20px] h-[300px] md:h-[420px]">
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              settings?.address ?? "",
            )}&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Overlay Card */}
          <div className="absolute left-2 bottom-4 md:left-8 md:bottom-8 bg-white rounded-[12px] shadow-[0_2px_35px_rgba(0,0,0,0.12)] p-3 md:p-[15px] max-w-[293px]">
            <h3 className="text-[#F2671C] font-bold uppercase text-xs md:text-base mb-2">
              {settings?.company_name}
            </h3>

            <p className="text-lightblack font-medium text-xs md:text-base">
              {settings?.address}
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom section-space">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-[30px]">
          <div className="">
            <h2
              className="mt-5 text-[30px] font-bold leading-[36px] text-[#22201C] sm:text-[36px] sm:leading-[40px] lg:text-[42px] lg:leading-[42px]"
            >
              Send Us a <span className="text-primary">Message</span>
            </h2>
            <p className="mx-auto mt-[15px] mb-10 text-base font-medium leading-[26px] text-[#4E4D49]">
              Fill out the form below and our team will get back to you shortly.
            </p>
            <Image
              src="/assets/images/contact-img.png"
              alt="Process"
              width={600}
              height={500}
              className="mt-[30px] w-full h-auto"
            />
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-5 shadow-[9px_10px_40px_0px_rgba(0,0,0,0.06)] p-5 rounded-[18px]"
          >
            {successMsg && (
              <p className="text-green text-center mb-5 font-medium">
                {successMsg}
              </p>
            )}
            {errorMsg && (
              <p className="text-red-500 text-center mb-5 font-medium">
                {errorMsg}
              </p>
            )}

            <div>
              <label className="text-lightblack font-medium mb-3 block text-base">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
                className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
              />
            </div>

            <div>
              <label className="text-lightblack font-medium mb-3 block text-base">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
                className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
              />
            </div>

            {/* Row 2 */}
            <div>
              <label className="text-lightblack font-medium mb-3 block text-base">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
              />
            </div>

            <div>
              <label className="text-lightblack font-medium mb-3 block text-base">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-lightblack font-medium mb-3 block text-base">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write a message"
                rows={5}
                required
                className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[20px] outline-none focus:border-green text-base placeholder:text-[#787675]"
              />
            </div>

            {/* Submit Button */}
            <div className="flex">
              <button
                type="submit"
                disabled={loading}
                className="py-[14px] px-[25px] rounded-[62px] font-semibold text-base transition flex items-center justify-center gap-3 h-[42px] text-white bg-orange hover:opacity-90 cursor-pointer"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
