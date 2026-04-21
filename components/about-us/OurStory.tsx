"use client";

import Image from "next/image"
import { useSettings } from "@/contexts/SettingsContext";

function OurStory() {
  const { companyName } = useSettings();

  return (
    <section className="container-custom mx-auto lg:mb-[110px] my-20 lg:mt-[142px]">
      <div className="grid grid-cols-12 lg:gap-[30px] items-center mt-10">
        <div className="col-span-12 lg:col-span-6 order-2 lg:order-1">
          <Image
            src="/assets/ourstory.png"
            alt="about"
            width={575}
            height={445}
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-span-12 lg:col-span-6 order-1 lg:order-2 mb-5 lg:mb-0">
          <h2 className="text-[38px] leading-[40px] mb-[15px] font-bold text-gray mont-text">
            Our <span className="text-orange">Story</span>
          </h2>
          <p className="mb-[15px] text-[16px] leading-[26px] font-normal text-text-gray">
            Founded with a passion for machinery and a mission to simplify equipment trading, {companyName} has become a trusted name in the industrial marketplace. What started as a small regional operation has grown into a leading online destination for machinery buyers and sellers worldwide.
          </p>
          <p className="mb-[15px] text-[16px] leading-[26px] font-normal text-text-gray">
            We recognized that the traditional way of buying and selling used machinery was often complicated, time-consuming, and risky. That's why we built a modern platform designed to bring clarity, confidence, and convenience to every transaction.
          </p>
          <p className="mb-[15px] text-[16px] leading-[26px] font-normal text-text-gray">
            At {companyName}, every listing represents more than just a machine — it's a connection between people who build, create, and drive industries forward. We take pride in offering transparent descriptions, verified listings, and fair pricing, ensuring our customers always know exactly what they're getting.
          </p>
        </div>
      </div>
    </section>
  )
}

export default OurStory
