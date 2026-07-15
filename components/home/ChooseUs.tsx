"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AdvantageCard from "./AdvantageCard";
import { useSettings } from "@/contexts/SettingsContext";

const chooseUsData = [
  {
    icon: "icon1.svg",
    title: "Verified Equipment",
    description:
      "Every machine is thoroughly inspected and accurately listed, so you know exactly what you're buying.",
  },
  {
    icon: "icon3.svg",
    title: "Secure Payments",
    description:
      "We use protected payment systems to ensure every transaction is safe, transparent, and reliable.",
  },
  {
    icon: "icon2.svg",
    title: "Trusted Sellers",
    description:
      "Our network consists of verified dealers and reputable sellers with proven track records.",
  },
  {
    icon: "icon4.svg",
    title: "Fast Delivery",
    description:
      "We coordinate efficient logistics to deliver your equipment quickly and hassle-free.",
  },
];

interface Advantage {
  id: number;
  icon: string;
  title: string;
  description: string;
}

const advantages: Advantage[] = [
  {
    id: 1,
    icon: '/assets/images/choose-icon1.svg',
    title: "Trusted Marketplace",
    description:
      "Buy and sell with confidence through a platform built on transparency, reliability, and industry expertise.",
  },
  {
    id: 2,
    icon: '/assets/images/choose-icon2.svg',
    title: "Verified Sellers",
    description:
      "Our network consists of trusted and verified sellers who meet strict quality standards.",
  },
  {
    id: 3,
    icon: '/assets/images/choose-icon3.svg',
    title: "Nationwide Reach",
    description:
      "Access equipment opportunities across the USA & Canada through one centralized marketplace.",
  },
  {
    id: 4,
    icon: '/assets/images/choose-icon4.svg',
    title: "Dedicated Support",
    description:
      "Our team is available throughout the buying process for a hassle-free experience.",
  },
];

function ChooseUs() {
   const { companyName } = useSettings();
  return (
    <>
     <section
      className="section-space bg-cover bg-center bg-no-repeat bg-[#1D1B1A]"
      style={{
        backgroundImage: `url(/assets/images/why-bg.png)`,
      }}
    >
      <div className="container-custom">
        {/* Heading */}

        <div className="mx-auto text-center">
          <span className="inline-flex items-center justify-center rounded-[66px] bg-[#F2671C] text-white px-5 py-[10px]  text-base font-semibold leading-4 text-primary">
            Our Advantages
          </span>

          <h2 className="mt-[30px] text-center text-[30px] font-bold leading-[36px] text-white sm:text-[36px] sm:leading-[38px] lg:text-[42px] lg:leading-[40px]">
            Why Choose <span className="text-primary">{companyName}?</span>
          </h2>
        </div>

        {/* Content */}

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[420px_1fr]">
          {/* Left */}

          <div className="relative w-full max-w-md mx-auto">
            <img
              src="/assets/images/why-image.png"
              alt="Why Choose"
              className="w-full rounded-[30px] object-cover"
            />

            {/* Content */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#F2671CD9] rounded-[15px] p-[15px]">
              <h3 className="text-white text-lg font-bold !leading-[18px]">
                Premium Quality
              </h3>

              <p className="text-[#FFF8F4] text-sm sm:text-lg mt-[10px]">
                Every listing reviewed & verified
              </p>
            </div>
          </div>

          {/* Right */}

          <div className="grid gap-6 sm:grid-cols-2">
            {advantages.map((item) => (
              <AdvantageCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

export default ChooseUs;
