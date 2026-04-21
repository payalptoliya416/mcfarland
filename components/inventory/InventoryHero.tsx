"use client";
import Image from "next/image";
import { motion } from "framer-motion";

function InventoryHero() {
  return (
    <section className="relative -mt-32">
      <div
        className="absolute top-0 left-0 w-full h-full xl:h-[500px] bg-[url(/assets/main-bg-test.png)] bg-no-repeat bg-top -z-10 bg-cover lg:bg-[length:100%_100%]"
      ></div>
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-12 pt-[130px] sm:pt-[120px] items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-12 lg:col-span-6 mb-5 lg:mb-0"
          >
            <h2 className="text-3xl md:text-[42px] leading-[48px] md:leading-[60px] font-bold mb-5 mont-text">
              Discover <span className="text-orange">Quality Machinery </span>{" "}
              for Every Need
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-para textbase leading-[24px] font-normal"
            >
              Browse a wide selection of used and new industrial machinery,
              tractors, tools, and equipment.Filter by category, make, model, or
              year and find the right machine for your business.
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-12 lg:col-span-6"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-end"
            >
              <Image
                src="/assets/inventoryhero.png"
                alt="inventory hero"
                width={530}
                height={389}
                style={{ height: "auto" }} 
                className="w-full h-auto max-w-[530px]"
                  loading="eager"  priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default InventoryHero;
