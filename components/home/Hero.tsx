"use client";

import Image from "next/image";
import Link from "next/link";
import { useSettings } from "@/contexts/SettingsContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { motion } from "framer-motion";

const data = [
  {
    icon: "/assets/images/Hero-icon-serve.svg",
    title: "Delivery anywhere within the",
    bold: "USA & Canada",
  },
  {
    icon: "/assets/images/herorevers.svg",
    title: "hassle-free returns",
    bold: "30-day",
  },
  {
    icon: "/assets/images/hero-icon2.svg",
    title: "warranty",
    bold: "6 months",
  },
];

function Hero() {
  const { companyName } = useSettings();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };
  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <>
      {isNavigating && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
          <Loader />
        </div>
      )}
      <section className="p-5 -mt-[150px] sm:-mt-[175px] lg:-mt-[180px] pb-0">
        <div className="relative rounded-3xl overflow-hidden min-h-[600] bg-cover bg-center bg-[url(/assets/images/hero-bg.png)]">
          <div className="relative z-10 flex items-center justify-center min-h-[720px]">
            <div className="container-custom text-center text-white pt-6 sm:pt-20 lg:pt-0">
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-[66px] bg-[#FCEBD242] px-5 py-[10px] mb-4 sm:mb-[30px]"
              >
                <span className="text-xl pl-2">•</span>

                <span className="text-xs sm:text-base">
                  Welcome to {companyName.toUpperCase()}
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  ease: "easeOut",
                }}
                className="mx-auto max-w-5xl text-center text-[26px] font-extrabold leading-[40px] sm:text-[42px] sm:leading-[52px] md:text-[48px] md:leading-[58px] lg:text-[60px] lg:leading-[72px] mb-5"
              >
                Reliable{" "}
                <span className="text-primary">
                  Industrial <span className="text-white">&amp;</span>{" "}
                  <span className="block lg:inline"> Farm</span>
                  <br className="hidden lg:block" />
                  Equipment
                </span>{" "}
                <span className="block lg:inline">Sales &amp; Auctions</span>
              </motion.h1>

              <motion.p
                custom={0.4}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mx-auto max-w-[790px] px-4 text-center text-sm font-medium leading-6 text-white sm:text-base sm:leading-[26px] mb-5 sm:mb-[35px]"
              >
                Buy or Bid on high-quality machinery, tractors, and tools from
                trusted sellers. Whether you're expanding your fleet or
                upgrading your equipment, {companyName} has you covered.
              </motion.p>
              <motion.div
                custom={0.6}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <Link
                  href="/inventory"
                  onClick={() => setIsNavigating(true)}
                  className="group inline-flex items-center justify-center gap-[10px]
                rounded-[62px] bg-primary px-[25px] py-3
                text-lg font-semibold text-white
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-[0_12px_30px_rgba(242,103,28,0.35)]"
                >
                  <span>Browse Inventory</span>

                  <Image
                    src="/assets/images/btn-right-errow.svg"
                    alt="Arrow"
                    width={18}
                    height={18}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-2"
                  />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="container-custom relative z-20 -mt-16 ">
          <div className="rounded-[24px] bg-white shadow-xl py-5 px-5 xl:px-[50px]">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {data.map((item, index) => (
                <div
                  key={index}
                  className={`
        relative flex items-center gap-[10px] py-4

        ${
          index === 0
            ? "md:pr-[47px]"
            : index === data.length - 1
              ? "xl:pl-[47px]"
              : "md:px-[47px]"
        }

        ${
          index !== data.length - 1
            ? "md:after:absolute md:after:right-0 md:after:top-1/2 md:after:h-[50px] md:after:w-px md:after:-translate-y-1/2 md:after:bg-gradient-to-b md:after:from-transparent md:after:via-[#22201C] md:after:to-transparent"
            : ""
        }
      `}
                >
                  <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#FCE1D2]/50">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={0}
                      height={0}
                      sizes="100vw"
                      unoptimized
                      className="w-auto h-auto"
                    />
                  </div>

                  <p className="text-base font-medium text-[#393733]">
                    {item.title}{" "}
                    <span className="font-bold text-[#22201C]">
                      {item.bold}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
