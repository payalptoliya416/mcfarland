"use client";
import Image from "next/image";
import { motion } from "framer-motion";

function TrackingHero() {
  return (
    <section className="relative -mt-32">
      {/* Background */}
      <div
        className="absolute top-0 left-0 w-full h-full xl:h-[500px] bg-[url(/assets/main-bg-test.png)] bg-no-repeat bg-top -z-10 bg-cover lg:bg-[length:100%_100%]"
      ></div>

      <div className="container-custom mx-auto">
        <div className="grid grid-cols-12 pt-[160px] items-center">

          {/* LEFT TEXT BLOCK */}
          <motion.div
            className="col-span-12 lg:col-span-6 mb-5 lg:mb-0"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2
              className="text-3xl md:text-[42px] leading-[48px] md:leading-[60px] font-bold mb-5 mont-text"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Track <span className="text-orange">Your Order</span>
            </motion.h2>

            <motion.p
              className="text-para textbase leading-[24px] font-normal"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              Easily check the status of your equipment order or shipment.
              Enter your tracking number below to see real-time updates
              on your delivery.
            </motion.p>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            className="col-span-12 lg:col-span-6"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                  className="-mr-9"
              >
                <Image
                  src="/assets/tracking.png"
                  alt="Hero"
                  width={679}
                  height={289}
                />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default TrackingHero;
