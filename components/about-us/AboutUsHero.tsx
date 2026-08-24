"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { motion } from "framer-motion";

function AboutUsHero() {
  const { companyName } = useSettings();

  return (
    <section className="p-5 -mt-[148px] sm:-mt-[167px] md:-mt-[179px] pb-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative rounded-3xl overflow-hidden min-h-[410px] bg-cover bg-center bg-[url(/assets/images/about-hero.png)] flex justify-center items-center md:bg-[length:100%_100%] bg-no-repeat"
      >
        <div className="relative z-10 pt-[132px] md:pt-[127px] pb-14 md:pb-[67px]">
          <div className="container-custom text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="mx-auto max-w-4xl text-center text-[28px] font-extrabold leading-[40px] sm:text-[42px] sm:leading-[52px] md:text-[48px] md:leading-[58px] lg:text-[60px] lg:leading-[72px] mb-5"
            >
              Your {" "}
              <span className="text-primary">
                 Trusted Partner 
              </span>{" "} 
             in Equipment Sales
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.4,
                ease: "easeOut",
              }}
              className="mx-auto max-w-[700px] px-4 text-center text-sm font-medium leading-6 text-white sm:text-base sm:leading-[26px]"
            >
             {companyName} connects buyers and sellers with reliable industrial machinery, tractors, and tools through seamless buying, selling, and bidding experiences.
            </motion.p>
          </div>
        </div>

      </motion.div>
    </section>
  );
}

export default AboutUsHero;
