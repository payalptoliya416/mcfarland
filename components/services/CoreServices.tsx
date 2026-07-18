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
    <section className="container-custom section-space">

      {/* Title Animation */}
      <div  className="text-center">
        <h2 className="text-3xl md:text-[42px] md:leading-[42px] mb-10 font-bold text-gray">
          Core <span className="text-orange">Services</span>
        </h2>
      </div>

      {/* Grid Animation */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[19px] items-stretch"
      >
      {[
  {
    icon: "/assets/images/service1.svg",
    title: "Equipment Sales",
    desc: "Each listing includes specs, verified images, and fair pricing for confident purchases.",
  },
  {
    icon: "/assets/images/service2.svg",
    title: "Equipment Auctions",
    desc: "Our system is transparent, real-time, and ensures fair competition so you always get the best value.",
  },
  {
    icon: "/assets/images/service3.svg",
    title: "Equipment Sourcing",
    desc: "Our team finds the perfect machinery or tool for your needs through a trusted global seller network.",
  },
  {
    icon: "/assets/images/service4.svg",
    title: "Equipment Inspection",
    desc: "We inspect every machine to ensure authenticity, accuracy, and reliable performance.",
  },
  {
    icon: "/assets/images/service5.svg",
    title: "Logistics & Tracking",
    desc: "We provide safe machinery transport with real-time tracking for complete delivery assurance.",
  },
  {
    icon: "/assets/images/service6.svg",
    title: "Customer Support",
    desc: "Buy from a wide selection of used and new industrial machines, tractors, and tools.",
  },
      ].map((service, index) => (
        <motion.div
          key={index}
          variants={cardVariant}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-[15px] bg-white p-6 sm:p-[30px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] min-h-[250px] flex flex-col"
        >
           <div className="absolute -top-13 -right-13 h-[154px] w-[154px] rounded-full bg-[#FFF3EC]" />
          {/* Icon */}
          <div className="relative z-10 mb-7 flex h-[66px] w-[66px] items-center justify-center rounded-full bg-[#FCE1D2]/50">
            <Image
              src={service.icon}
              alt={service.title}
              width={26}
              height={26}
            />
          </div>

          {/* Title */}
          <h3 className="relative z-10 mb-[10px] text-lg !leading-[18px] font-bold text-lightblack">
            {service.title}
          </h3>

          {/* Description */}
          <p className="relative z-10 text-base !leading-[26px] font-medium text-para">
            {service.desc}
          </p>
        </motion.div>
      ))}
      </div>
    </section>
  );
}

export default CoreServices;
