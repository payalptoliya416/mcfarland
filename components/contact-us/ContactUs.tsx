"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";

function ContactUs() {
  const { companyName } = useSettings();

  return (
    <>
      <section className="relative -mt-[136px]">

        {/* ⭐ Background Fade-in First */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full xl:h-[500px] bg-[url(/assets/main-bg-test.png)] bg-no-repeat bg-top -z-10 bg-cover lg:bg-[length:100%_100%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>

        <div className="container-custom mx-auto">
          <div className="grid grid-cols-12 pt-[150px] xl:pt-[100px] items-center">

            {/* ⭐ Content Animates AFTER Background */}
            <motion.div
              className="col-span-12 lg:col-span-6 mb-5 lg:mb-0"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.h2
                className="text-3xl md:text-[42px] leading-[48px] md:leading-[60px] font-bold mb-5 mont-text"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              >
                <span className="text-orange">Get in Touch </span>
                with {companyName}
              </motion.h2>

              <motion.p
                className="text-para textbase leading-[24px] font-normal"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              >
                Buy or Bid on high-quality machinery, tractors, and tools from trusted
                sellers. Whether you're expanding your fleet or upgrading your
                equipment, {companyName} has you covered.
              </motion.p>
            </motion.div>

            {/* Right Image */}
            <motion.div
              className="col-span-12 lg:col-span-6"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex justify-end">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
                  className="-mr-9"
                >
                  <Image
                    src="/assets/contact.png"
                    alt="Hero"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto max-w-[600px]"
                  />
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}

export default ContactUs;
