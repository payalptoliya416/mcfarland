"use client";

import { JSX } from "react";
import { motion } from "framer-motion";

export default function TrackingForm(): JSX.Element {
  
  const inputItem = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  } as const;

  return (
    <div className="w-full flex justify-center px-4 my-20 xl:mb-16 xl:mt-[141px]">
      <div
        className="max-w-[700px] w-full border border-border rounded-2xl p-4 sm:p-8 shadow-sm"
      >
        {/* Title */}
        <h2
          className="text-3xl md:text-[38px] font-bold text-center text-gray-900 mb-3 mont-text"
        >
          Enter Your <span className="text-orange">Tracking Number</span>
        </h2>

        <p
          className="text-center text-gray-500 mb-10 leading-relaxed"
        >
          Please enter your Order ID or Tracking Number provided in your
          confirmation email.
        </p>

        {/* FORM FIELDS WITH STAGGER */}
        <form
          className="space-y-5"
        >
          {/* Tracking Number */}
          <div>
            <label className="text-gray-800 font-medium mont-text">Tracking Number</label>
            <input
              type="text"
              placeholder="Tracking Number"
              className="
                w-full mt-2 px-5 py-[18px] border border-border rounded-xl
                outline-none focus:ring-2 focus:ring-green
              "
            />
          </div>

          {/* Email + Phone Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-800 font-medium mont-text">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                className="
                  w-full mt-2 px-5 py-[18px] border border-border rounded-xl
                  outline-none focus:ring-2 focus:ring-green
                "
              />
            </div>

            <div>
              <label className="text-gray-800 font-medium mont-text">Phone Number</label>
              <input
                type="text"
                placeholder="Enter your phone number"
                className="
                  w-full mt-2 px-5 py-[18px] border border-border rounded-xl
                  outline-none focus:ring-2 focus:ring-green
                "
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.div
            variants={inputItem}
            className="flex justify-center pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              type="submit"
              className="
                bg-green text-white px-10 py-3 rounded-lg 
                font-semibold text-lg hover:opacity-90 transition mont-text
              "
            >
              Track Now
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
