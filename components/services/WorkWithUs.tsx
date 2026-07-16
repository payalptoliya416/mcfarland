"use client";
import Image from "next/image";
import { motion } from "framer-motion";

function WorkWithUs() {
  const items = [
    {
      title: "Transparent Transactions",
      desc: "Clear listings and honest communication.",
    },
    {
      title: "Competitive Pricing",
      desc: "Fair market rates through direct sales or auctions.",
    },
    {
      title: "Global Network",
      desc: "Buyers and sellers from multiple regions.",
    },
    {
      title: "End-to-End Support",
      desc: "From inspection to delivery, we handle everything.",
    },
    {
      title: "Proven Experience",
      desc: "Years of industry knowledge and satisfied clients.",
    },
  ];

  const features = [
  {
    icon: "/assets/images/work1.svg",
    title: "Transparent Transactions",
    desc: "Clear listings and honest communication.",
  },
  {
    icon: "/assets/images/work2.svg",
    title: "Competitive Pricing",
    desc: "Fair market rates through direct sales or auctions.",
  },
  {
    icon: "/assets/images/work3.svg",
    title: "Global Network",
    desc: "Buyers and sellers from multiple regions.",
  },
  {
    icon: "/assets/images/work4.svg",
    title: "End-to-End Support",
    desc: "From inspection to delivery, we handle everything.",
  },
  {
    icon: "/assets/images/work5.svg",
    title: "Proven Experience",
    desc: "Years of industry knowledge and satisfied clients.",
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
     <section className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">

          {/* Left Side */}
          <div>
            <h2 className="text-3xl md:text-[42px] md:leading-[42px] font-bold text-gray mb-[25px]">
              <span className="text-[#22201C]">Why </span>
              <span className="text-primary">Work With</span>
              <span className="text-[#22201C]"> Us</span>
            </h2>

          <div className="space-y-4 lg:space-y-5">
  {features.map((item, index) => (
    <div
      key={index}
      className="flex items-center gap-3 sm:gap-4 lg:gap-[25px] rounded-[16px] lg:rounded-[20px] bg-white p-4 sm:p-5 shadow-[0_2px_35px_rgba(0,0,0,0.08)]"
    >
      {/* Icon */}
      <div className="w-[48px] h-[48px] sm:w-[54px] sm:h-[54px] rounded-full bg-[#FCE1D2] flex items-center justify-center shrink-0">
        <Image
          src={item.icon}
          alt={item.title}
          width={26}
          height={26}
          className="w-5 h-5 sm:w-[26px] sm:h-[26px]"
        />
      </div>

      {/* Divider */}
      <div className="w-px self-stretch bg-[#D8D8D8] my-2 sm:my-3" />

      {/* Content */}
      <div className="min-w-0">
        <h3 className="text-base sm:text-lg font-bold text-lightblack">
          {item.title}
        </h3>

        <p className="text-sm sm:text-base leading-6 sm:leading-[32px] text-para">
          {item.desc}
        </p>
      </div>
    </div>
  ))}
</div>
          </div>

          {/* Right Side */}
          <div className="relative">
            <img
              src="/assets/images/work.png"
              alt=""
              className=""
            />

            {/* Badge */}
            <div className="absolute left-4 sm:left-6 lg:left-0 bottom-4 sm:bottom-6 lg:bottom-8 lg:-translate-x-[20%] rounded-[12px] bg-primary p-3 sm:p-4 shadow-[0_2px_25px_rgba(0,0,0,0.15)] flex items-center gap-3 max-w-[260px] sm:max-w-none">
  {/* Icon */}
  <div className="w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full bg-[#FCE1D270] flex items-center justify-center shrink-0">
    <img
      src="/assets/images/check.svg"
      alt=""
      className="w-5 sm:w-7"
    />
  </div>

  {/* Text */}
  <div>
    <p className="text-white text-sm sm:text-base font-semibold leading-tight">
      Built on <span className="font-bold">Trust.</span>
    </p>
    <p className="text-white text-sm sm:text-base font-semibold leading-tight mt-1">
      Driven by <span className="font-bold">Result.</span>
    </p>
  </div>
           </div>
          </div>

        </div>
     </section>
  );
}

export default WorkWithUs;
