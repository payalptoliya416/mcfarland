"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getSettingsByKeysFooter } from "@/api/categoryActions";

function Location() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSettingsByKeysFooter().then((res) => {
      if (res.success) {
        setSettings(res.data);
      }
    });
  }, []);

  const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;

  const containerVariant = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  } as const;

    if (!settings) return null;

const locations = [
  {
    icon: "/assets/images/location-icon.svg",
    title: "Office Address",
    desc: `${settings.company_name} ${settings.address}`,
  },
  {
    icon: "/assets/images/call-icon.svg",
    title: "Phone Number",
    desc: settings.phone_no,
  },
  {
    icon: "/assets/images/clock-icon.svg",
    title: "Working Hours",
    desc: "9am - 4pm (MDT) Monday to Friday",
  },
  {
    icon: "/assets/images/mail-icon.svg",
    title: "Email Address",
    desc: settings.email,
  },
];
  
  return (
    <>
       <section className="py-10 lg:py-16">
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Address */}
          <div className="bg-white rounded-[14px] shadow-[0_2px_35px_rgba(0,0,0,0.08)] p-[25px] flex flex-col justify-between xl:min-h-[350px]">
            <div>
              <div className="w-12 md:w-[60px] h-12 md:h-[60px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center">
               <img src={locations[0].icon} alt="" />
              </div>

             <h3 className="text-lg leading-[18px] font-bold text-lightblack mt-5">
              {locations[0].title}
            </h3>

              <p className="text-para text-base leading-8 mt-4">
                  <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  settings.address ?? ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green transition"
              >
                {locations[0].desc}
              </a>
              </p>
            </div>

            <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              settings.address ?? ""
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#F26522] font-semibold text-base hover:gap-3 transition-all"
          >
            Get Direction

            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.77502 12.15L14.4 6.52502L8.77502 0.900024M14.4 6.52502H0.900024"
                stroke="#F2671C"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          </div>

          {/* Right */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Phone */}
            <div className="bg-white rounded-[14px] shadow-[0_2px_35px_rgba(0,0,0,0.08)] p-[25px]">
              <div className="w-12 md:w-[60px] h-12 md:h-[60px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center">
               <img src={locations[1].icon} alt="" />
              </div>

              <h3 className="text-lg leading-[18px] font-bold text-lightblack mt-5">
                {locations[1].title}
              </h3>

              <p className="text-para text-base mt-[10px]">
               <a
              href={`tel:${settings.phone_no}`}
              className="hover:text-green transition"
            >
              {settings.phone_no}
            </a>

              </p>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-[14px] shadow-[0_2px_35px_rgba(0,0,0,0.08)] p-[25px]">
              <div className="w-12 md:w-[60px] h-12 md:h-[60px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center">
              <img src={locations[2].icon} alt="" />
              </div>

              <h3 className="text-lg leading-[18px] font-bold text-lightblack mt-5">
               {locations[2].title}
              </h3>

              <p className="text-para text-base mt-[10px] leading-8">
                 {locations[2].desc}
              </p>
            </div>

            {/* Email */}
            <div className="md:col-span-2 bg-white rounded-[14px] shadow-[0_2px_35px_rgba(0,0,0,0.08)] p-[25px] flex flex-col md:flex-row md:items-end md:justify-between gap-6">

              <div>
                <div className="w-12 md:w-[60px] h-12 md:h-[60px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center">
                    <img src={locations[2].icon} alt="" />
                </div>

                <h3 className="text-lg leading-[18px] font-bold text-lightblack mt-5">
                    {locations[2].title}
                </h3>

                <p className="text-para text-base mt-[10px] break-all">
                 <a
              href={`mailto:${settings.email}`}
              className="hover:text-green transition"
            >
              {settings.email}
            </a>
                </p>
              </div>

              <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-2 text-[#F26522] font-semibold text-base hover:gap-3 transition-all whitespace-nowrap"
            >
              Send Email

              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.77502 12.15L14.4 6.52502L8.77502 0.900024M14.4 6.52502H0.900024"
                  stroke="#F2671C"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            </div>

          </div>
        </div>
      </div>
    </section>
    </>
  );
}

export default Location;
