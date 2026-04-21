"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1], 
    },
  },
} as const;

function CoreServices() {
  return (
    <section className="container-custom mx-auto my-20 lg:my-[110px]">

      {/* Title Animation */}
      <div  className="text-center">
        <h2 className="text-3xl md:text-[38px] md:leading-[38px] mb-10 lg:mb-20 font-bold text-gray mont-text">
          Core <span className="text-orange">Services</span>
        </h2>
      </div>

      {/* Grid Animation */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] items-stretch"
      >
        {[
          {
            icon: "/assets/e1.svg",
            title: "Equipment Sales",
            desc: "Each listing includes specs, verified images, and fair pricing for confident purchases.",
          },
          {
            icon: "/assets/e6.svg",
            title: "Equipment Auctions",
            desc: "Our system is transparent, real-time, and ensures fair competition so you always get the best value.",
          },
          {
            icon: "/assets/e2.svg",
            title: "Equipment Sourcing",
            desc: "Our team finds the perfect machinery or tool for your needs through a trusted global seller network.",
          },
          {
            icon: "/assets/e3.svg",
            title: "Equipment Inspection",
            desc: "We inspect every machine to ensure authenticity, accuracy, and reliable performance.",
          },
          {
            icon: "/assets/e4.svg",
            title: "Logistics & Tracking",
            desc: "We provide safe machinery transport with real-time tracking for complete delivery assurance.",
          },
          {
            icon: "/assets/e5.svg",
            title: "Customer Support",
            desc: "Buy from a wide selection of used and new industrial machines, tractors, and tools.",
          },
        ].map((service, index) => (
          <motion.div
            key={index}
            variants={cardVariant}
            className="h-full flex justify-center items-center flex-col border border-border rounded-xl p-[25px] text-center bg-white"
          >
            {/* Icon Animation */}
            <motion.div
              className="w-20 h-20 rounded-[10px] flex justify-center items-center mb-[30px] bg-green"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image src={service.icon} alt="icon" width={40} height={40} />
            </motion.div>

            <h3 className="text-gray mb-[10px] text-xl leading-[20px] font-semibold mont-text">
              {service.title}
            </h3>

            <p className="text-text-gray text-base font-normal">{service.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default CoreServices;
