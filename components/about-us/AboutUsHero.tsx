"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";

function AboutUsHero() {
  const { companyName } = useSettings();

  return (
    <section className="relative -mt-32">
      {/* Background */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full xl:h-[500px] bg-[url(/assets/main-bg-test.png)] bg-no-repeat bg-top -z-10 bg-cover lg:bg-[length:100%_100%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <div className="container-custom mx-auto">
        <div className="grid grid-cols-12 pt-[150px] md:pt-[120px] items-center">

          {/* LEFT CONTENT */}
          <motion.div
            className="col-span-12 lg:col-span-6 mb-5 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-[42px] leading-[48px] md:leading-[60px] font-bold mb-5 mont-text">
              Your<span className="text-orange"> Trusted Partner </span>{" "}
              in Equipment Sales
            </h2>

            <p className="text-para textbase leading-[24px] font-normal">
              {companyName} connects buyers and sellers with reliable industrial
              machinery, tractors, and tools through seamless buying, selling, and
              bidding experiences.
            </p>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            className="col-span-12 lg:col-span-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <div className="flex justify-end">
              <motion.div>
                <Image
                  src="/assets/about-hero.png"
                  alt="Hero"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto max-w-[530px]"
                  loading="eager" priority
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutUsHero;
