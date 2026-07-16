"use client";

import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";

function Testimonial() {
  const { companyName } = useSettings();

  return (
    <section className="section-space">
      <div className="container-custom mx-auto ">
      <div className="text-center">
         <span className="inline-flex rounded-full bg-[#F2671C] px-5 py-[10px] text-base !leading-[16px] font-semibold text-white">
            Testimonial
            </span>
            {/* Heading */}
            <h2 className="mt-[30px] text-[30px] font-bold leading-[36px] text-[#22201C] sm:text-[36px] sm:leading-[40px] lg:text-[42px] lg:leading-[42px]">
              What {" "}
              <span className="text-orange">Our Clients</span> Say
             ?
            </h2>
      </div>
        <div className="grid grid-cols-12 gap-[35px]">
       <div className="col-span-12 lg:col-span-4">
  <div className="relative">

    {/* Content */}
    <div className="relative z-10 px-10 pt-10 pb-20">
      <img
        src="/assets/images/quote.svg"
        alt=""
        className="mb-[30px]"
      />

      <p className="text-lg leading-[28px] text-[#4A4A4A] font-medium">
        “Selling my machinery through {companyName} was seamless.
        Their team handled everything professionally, and I received great
        value within days. Highly recommended!”
      </p>
    </div>

    {/* Profile */}
    <div className="absolute left-0 bottom-0 translate-y-1/2 z-20 flex items-center gap-4 bg-white rounded-tr-[32px] pr-8 pt-5 pb-4">
      <img
        src="/assets/images/client.png"
        alt=""
        className="w-16 h-16 rounded-full object-cover"
      />

      <div>
        <h4 className="text-[24px] font-semibold text-[#F97316]">
          Robert F
        </h4>
        <p className="text-xl text-[#555]">Supplier</p>
      </div>
    </div>
  </div>
</div>
      </div>
      </div>
    </section>
  );
}

export default Testimonial;
