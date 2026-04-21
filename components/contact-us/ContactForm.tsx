"use client";

import { JSX, useState } from "react";
import { motion } from "framer-motion";
import { sendContactEmail } from "@/api/categoryActions";

export default function ContactForm(): JSX.Element {
  const containerVariant = {
    hidden: { opacity: 0, y: 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  } as const;

  const staggerGroup = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  } as const;

  const inputVariant = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  } as const;

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    setErrorMsg(
      error?.message || "Server error. Please try again later."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-full">

      {/* MAP IFRAME SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="w-full h-[407px] overflow-hidden"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3157185.6322221!2d-103.977764847624!3d37.275679805810795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54b04f72c2b8c001%3A0x4c90d5d1d1e4aef!2sUnited%20States!5e0!3m2!1sen!2sus!4v1708954054231!5m2!1sen!2sus"
          width="100%"
          height="100%"
          loading="lazy"
          style={{ border: 0 }}
        ></iframe>
      </motion.div>

      {/* FORM SECTION */}
      <div className="mx-5">
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-[900px] w-full mx-auto -mt-[150px] bg-white p-7 md:p-10 relative z-50 border border-border rounded-[20px]"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-3xl md:text-[38px] font-bold text-center text-gray mb-[15px] mont-text"
          >
            Send Us a <span className="text-orange">Message</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-text-gray text-center mb-10 text-base"
          >
            Fill out the form below and our team will get back to you shortly.
          </motion.p>
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

          {/* FORM WITH STAGGERED INPUTS */}
          <motion.form
  onSubmit={handleSubmit}
  variants={staggerGroup}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.3 }}
  className="space-y-[30px]"
>
  {/* Row 1 */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <motion.div variants={inputVariant}>
      <label className="text-lightblack font-medium text-lg mb-3 mont-text">
        First Name
      </label>
      <input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        placeholder="Enter your first name"
        required
        className="w-full mt-2 px-5 py-[13px] border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-green text-base leading-[16px]"
      />
    </motion.div>

    <motion.div variants={inputVariant}>
      <label className="text-lightblack font-medium text-lg mb-3 mont-text">
        Last Name
      </label>
      <input
        type="text"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        placeholder="Enter your last name"
        required
        className="w-full mt-2 px-5 py-[13px] border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-green text-base leading-[16px]"
      />
    </motion.div>
  </div>

  {/* Row 2 */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <motion.div variants={inputVariant}>
      <label className="text-lightblack font-medium text-lg mb-3 mont-text">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email address"
        required
        className="w-full mt-2 px-5 py-[13px] border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-green text-base leading-[16px]"
      />
    </motion.div>

    <motion.div variants={inputVariant}>
      <label className="text-lightblack font-medium text-lg mb-3 mont-text">
        Phone Number
      </label>
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Enter your phone number"
        required
        className="w-full mt-2 px-5 py-[13px] border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-green text-base leading-[16px]"
      />
    </motion.div>
  </div>

  {/* Message */}
  <motion.div variants={inputVariant}>
    <label className="text-lightblack font-medium text-lg mb-3 mont-text">
      Message
    </label>
    <textarea
      name="message"
      value={formData.message}
      onChange={handleChange}
      placeholder="Write a message"
      rows={5}
      required
      className="w-full mt-2 px-5 py-[13px] border border-border rounded-[10px] outline-none focus:ring-2 focus:ring-green resize-none text-base leading-[16px]"
    />
  </motion.div>

  {/* Submit Button */}
  <motion.div variants={inputVariant} className="flex justify-center">
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      type="submit"
      disabled={loading}
      className="bg-green text-white px-[22px] py-[14px] rounded-lg font-semibold text-base leading-[16px] hover:opacity-90 transition mont-text disabled:opacity-60"
    >
      {loading ? "Sending..." : "Send Message"}
    </motion.button>
  </motion.div>
         </motion.form>
        </motion.div>
      </div>
    </div>
  );
}
