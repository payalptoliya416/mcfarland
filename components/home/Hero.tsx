"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSettings } from "@/contexts/SettingsContext";
import { FiTruck, FiRefreshCw, FiShield } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";

function Hero() {
  const { companyName } = useSettings();
const pathname = usePathname();
const [isNavigating, setIsNavigating] = useState(false);

useEffect(() => {
  setIsNavigating(false);
}, [pathname]);

  return (
    <>
    {isNavigating && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
    <Loader />
  </div>
)}
    <section className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="-mt-32 absolute top-0 left-0 w-full h-full lg:h-[750px] xl:lg:h-[770px] bg-[url(/assets/main-bg-test.png)] bg-no-repeat bg-top -z-10  bg-cover lg:bg-[length:100%_100%]"
      ></motion.div>
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-12 pt-10 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-12 lg:col-span-6"
          >
            <h4 className="text-gray text-lg xl:text-xl font-semibold mb-4 xl:mb-6 relative after:absolute after:top-3 after:left-0 after:bg-gray after:w-[15px] after:h-[2px] pl-5 after:rounded-full mont-text">
              Welcome to {companyName.toUpperCase()}
            </h4>
            <h2 className="text-2xl sm:text-4xl xl:text-[50px] font-bold text-gray  sm:leading-[52px] xl:leading-[68px] mb-5 mont-text">
              Reliable <span className="text-orange">Industrial</span> &{" "}
              <span className="text-orange">Farm Equipment</span> Sales &
              Auctions
            </h2>
            <p className="text-para text-base font-normal mb-5 leading-[26px]">
              Buy or Bid on high-quality machinery, tractors, and tools from
              trusted sellers. Whether you're expanding your fleet or upgrading
              your equipment, {companyName} has you covered.
            </p>
            <div className="mt-6 flex flex-col gap-5">
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-800">
                  <FiTruck className="text-base text-gray-700" />
                  <span>
                    Delivery anywhere within the <strong>USA & Canada</strong>
                  </span>
                </li>

                <li className="flex items-center gap-3 text-sm text-gray-800">
                  <FiRefreshCw className="text-base text-gray-700" />
                  <span>
                    <strong>30-day</strong> hassle-free returns
                  </span>
                </li>

                <li className="flex items-center gap-3 text-sm text-gray-800">
                  <FiShield className="text-base text-gray-700" />
                  <span>
                    <strong>6 months</strong> warranty
                  </span>
                </li>
              </ul>
              <Link
                href="/inventory"
                 onClick={() => setIsNavigating(true)}
                className="inline-flex w-fit items-center justify-center rounded-lg bg-gray px-7 py-3
             font-semibold text-white mont-text transition-all duration-300 hover:bg-green/90 hover:shadow-md">
                Browse Inventory
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="col-span-12 lg:col-span-6 mt-10 2xl:mt-8  hero-img-margin"
          >
            <Image
              src="/assets/zasi1.png"
              alt="Hero"
              width={749}
              height={609}
              loading="eager"
              priority
              className="w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
    </>
  );
}

export default Hero;
