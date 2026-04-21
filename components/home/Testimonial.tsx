"use client";

import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";

function Testimonial() {
  const { companyName } = useSettings();

  return (
    <section className="bg-[#E9E9E940] py-[60px]">
      <div className="container-custom mx-auto ">

        {/* Title Animation */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-[38px] md:leading-[38px] mb-[15px] font-bold text-gray  mont-text">
            What <span className="text-orange">Our Clients</span> Say
          </h2>
        </motion.div>

        {/* Grid with Stagger Animation */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {/* Testimonial Cards */}
          {[
            {
              img: "/assets/client1.png",
              name: "Robert Fox",
              role: "Industrial Supplier",
              text: `“Selling my machinery through ${companyName} was seamless. Their team handled everything professionally, and I received great value within days. Highly recommended!”`,
            },
            {
              img: "/assets/client2.png",
              name: "Kathryn Murphy",
              role: "Equipment Dealer",
              text: `“Fantastic experience from start to finish! The website is easy to use, and the support team helped me find the perfect excavator within my budget.”`,
            },
            {
              img: "/assets/client3.png",
              name: "Jerome Bell",
              role: "Owner",
              text: `“I participated in my first online auction with ${companyName}, and it was incredibly smooth, transparent, and secure. Highly trustworthy and efficient service!”`,
            },
            {
              img: "/assets/client4.png",
              name: "Jenny Wilson",
              role: "Construction Manager",
              text: `“${companyName} made the entire buying process easy. Excellent communication, transparent bidding, and fast delivery. I'll definitely return for my next equipment purchase!”`,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: "easeOut" },
                },
              }}
              whileHover={{
                scale: 1.03,
                transition: { type: "spring", stiffness: 200, damping: 12 },
              }}
              className="bg-white border border-border rounded-xl p-[30px] cursor-pointer"
            >
              <div className="flex justify-between items-center mb-5 flex-col sm:flex-row gap-3 sm:gap-1">
                <div className="flex items-center gap-[15px]">
                  <Image
                    src={item.img}
                    alt="client"
                    width={75}
                    height={75}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="text-gray text-xl leading-[20px] mb-[10px] font-semibold  mont-text">
                      {item.name}
                    </h3>
                    <p className="text-text-gray text-base leading-[16px] font-normal">
                      {item.role}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center items-center">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <FaStar key={idx} size={22} className="text-[#FFAD01]" />
                  ))}
                </div>
              </div>

              <p className="text-base leading-[26px] text-text-gray font-normal">
                {item.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonial;
