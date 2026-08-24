"use client";

import { motion } from "framer-motion";

function InventoryHero() {
  return (
        <section className="p-5 -mt-[148px] sm:-mt-[167px] md:-mt-[179px] pb-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative rounded-3xl overflow-hidden min-h-[410px] bg-cover bg-center bg-[url(/assets/images/invetory-bg.png)] flex justify-center items-center md:bg-[length:100%_100%] bg-no-repeat"
      >
        <div className="relative z-10 pt-[132px] md:pt-[142px] xl:pt-[127px] pb-14 md:pb-[67px]">
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
              className="mx-auto max-w-[860px] text-center text-[28px] font-extrabold leading-[40px] sm:text-[42px] sm:leading-[52px] md:text-[48px] md:leading-[58px] lg:text-[60px] lg:leading-[72px] mb-5"
            >
            Discover {" "}
              <span className="text-primary">
                Quality Machinery
              </span>{" "} 
             for Every Need
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
              className="mx-auto max-w-[740px] px-4 text-center text-sm font-medium leading-6 text-white sm:text-base sm:leading-[26px]"
            >
             Browse a wide selection of used and new industrial machinery, tractors, tools, and equipment.Filter by category, make, model, or year  and find the right machine for your business.
            </motion.p>
          </div>
        </div>

      </motion.div>
    </section>
  );
}

export default InventoryHero;
