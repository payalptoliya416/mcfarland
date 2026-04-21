"use client";
import Image from "next/image";
import { motion } from "framer-motion";

function ServicesHero() {
  return (
    <section className="relative -mt-32">
      {/* Background */}
      <div
        className="absolute top-0 left-0 w-full h-full xl:h-[500px] bg-[url(/assets/main-bg-test.png)] bg-no-repeat bg-top -z-10 bg-cover lg:bg-[length:100%_100%]"
      ></div>

      <div className="container-custom mx-auto">
        <div className="grid grid-cols-12 pt-[150px] md:pt-[130px] items-center">

          {/* LEFT TEXT AREA */}
          <motion.div
            className="col-span-12 lg:col-span-6 mb-5 lg:mb-0"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.h2
              className="text-3xl md:text-[42px] leading-[48px] md:leading-[60px] font-bold mb-5 mont-text"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              Reliable Solutions for{" "}
              <span className="text-orange">Buying and Selling</span>{" "}
              Equipment
            </motion.h2>

            <motion.p
              className="text-para textbase leading-[24px] font-normal"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              We make machinery trading simple and secure offering trusted
              services for buying, selling, and transporting industrial machines
              worldwide.
            </motion.p>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            className="col-span-12 lg:col-span-6"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                  className="-mr-9"
              >
                <Image
                  src="/assets/services-hero.png"
                  alt="Hero"
                  width={556}
                  height={380}
                />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default ServicesHero;
