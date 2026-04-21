'use client'

import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "../common/Loader";

function AboutUs() {
  const { companyName } = useSettings();
const router = useRouter();
const [redirectLoading, setRedirectLoading] = useState(false);
  return (
    <>
    {redirectLoading && (
  <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
    <Loader />
  </div>
)}
    <section className="container-custom mx-auto">
      <motion.div
        className="grid grid-cols-12 lg:gap-[30px] items-center hero-custom-mt">
        <div
          className="col-span-12 lg:col-span-6 order-2 lg:order-1">
          <Image
            src="/assets/about.png"
            alt="about"
            width={575}
            height={445}
            style={{ width: "100%" }}
          />
        </div>
        <div
          className="col-span-12 lg:col-span-6 order-1 lg:order-2 mb-5 lg:mb-0">
          <h4 className="mb-5 text-orange text-xl font-semibold relative after:absolute after:top-3 after:left-0 after:bg-orange after:w-[15px] after:h-[2px] pl-5 after:rounded-full mont-text">
            {" "}
            About Us
          </h4>
          <h2 className="text-gray mb-[15px] font-bold text-[30px] leading-[44px] mont-text">
            Powering the Future of Equipment Trading
          </h2>
          <p className="mb-[15px] text-[16px] leading-[26px] font-normal  text-text-gray">
            At {companyName}, we specialize in the buying, selling, and
            auctioning of high-quality industrial machinery, tractors, farm
            tools, and construction equipment.
          </p>
          <p className="mb-[15px] text-[16px] leading-[26px] font-normal  text-text-gray">
            Our mission is simple to connect trusted sellers with serious buyers
            through a secure, transparent, and easy-to-use online platform.
          </p>
          <p className="mb-[15px] text-[16px] leading-[26px] font-normal  text-text-gray">
            Whether you’re looking to purchase your next machine or sell your
            existing equipment, we provide the expertise, tools, and exposure
            you need to make every transaction smooth and successful.
          </p>
         <button
          onClick={() => {
            setRedirectLoading(true);
            router.push("/about-us");
          }} className="group relative overflow-hidden inline-block text-base py-[14px] px-[22px] text-white rounded-lg bg-gray transition-all duration-300 mont-text cursor-pointer">
            <span className="relative z-10 flex items-center cursor-pointer font-semibold">
              Read More
              <FaArrowRight
                className="inline-block ms-[10px] transition-all duration-300 group-hover:translate-x-2"
              />
            </span>
            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-500"></span>
          </button>
        </div>
      </motion.div>
    </section>
    </>
  );
}

export default AboutUs;
