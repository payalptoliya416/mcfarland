"use client";

import Image from "next/image";
import { motion } from "framer-motion";

function TrustDriven() {
  const items = [
    {
      title: "Carefully verified equipment with accurate details",
    },
    {
      title: "Clear and transparent buying process",
    },
    {
      title: "Expert guidance at every stage",
    },
    {
      title: "Secure and hassle-free transactions",
    },
  ];

  const listContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };
  return (
    <section className="container-custom mx-auto lg:mb-[110px] my-10 sm:my-20 lg:mt-[142px]">
      <div className="grid grid-cols-12 lg:gap-[30px] items-stretch mt-10">
        {/* RIGHT TEXT + LIST */}
          <motion.div
          className="col-span-12 lg:col-span-6 h-full mb-5 lg:mb-0"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="block lg:hidden">
            <Image
              src="/assets/mark.png"
              alt="about"
              width={575}
              height={445}
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>

          {/* Desktop Fill Image */}
          <div className="hidden lg:block relative w-full h-full rounded-2xl overflow-hidden">
            <Image
              src="/assets/mark.png"
              alt="about"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          className="col-span-12 lg:col-span-6 mb-5 lg:mb-0"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          {/* Heading */}
          <h2 className="text-[32px] sm:text-[38px] font-bold text-gray mb-[20px] mont-text">
            Built on <span className="text-orange">trust, driven </span> by
            experience
          </h2>
          <p className="text-text-gray text-base leading-[26px] mb-[15px]">
            We help buyers make confident equipment decisions through
            transparency, industry knowledge, and a customer-first approach
            ensuring every transaction is clear, secure.
          </p>
          <p className="text-text-gray text-base leading-[26px] mb-[15px]">
            Our platform connects buyers with high-quality equipment through a
            secure and transparent process. With expert checks and clear
            communication, we ensure every purchase is smooth and dependable.
          </p>

          {/* Staggered List */}
          <motion.div
            className="space-y-[15px]"
            variants={listContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="bg-[linear-gradient(90deg,#FFAD0114,#FFAD0100)] p-[16px] rounded-xl flex gap-3 items-center"
              >
                <div>
                  <Image
                    src="/assets/check-new.svg"
                    alt="check"
                    width={20}
                    height={20}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray mont-text">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      
      </div>
    </section>
  );
}

export default TrustDriven;
