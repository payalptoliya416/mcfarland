import Image from "next/image";
import Link from "next/link";
import { useSettings } from "@/contexts/SettingsContext";
import { benefitsData } from "./benefitsData";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

function WhyBuy() {
  const { companyName } = useSettings();
  return (
    <>
       <section className="section-space">
        <div className="container-custom">
          <div className="mx-auto text-center">
            {/* Badge */}
            <motion.span
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="inline-flex rounded-full bg-[#F2671C] px-5 py-[10px] text-base !leading-[16px] font-semibold text-white"
            >
              Buyer Benefits
            </motion.span>
            {/* Heading */}
            <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-[30px] text-[30px] font-bold leading-[36px] text-[#22201C] sm:text-[36px] sm:leading-[40px] lg:text-[42px] lg:leading-[42px]"
              >
              Why Buy From{" "}
              <span className="text-primary">{companyName}</span>{" "}
             ?
            </motion.h2>
            {/* Description */}
              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mt-[15px] text-center text-base font-medium leading-[26px] text-[#4E4D49]"
              >
              We simplify equipment purchasing by providing accurate
              information, secure transactions, and dependable logistics
              support.
            </motion.p>
          </div>
         <div className="mt-10 space-y-8">
            {benefitsData.map((item) => (
                <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
                key={item.id}
                className="overflow-hidden rounded-[20px] bg-white p-6 shadow-[0_2px_35px_rgba(0,0,0,0.08)] lg:p-10"
                >
                <div
                    className={`grid items-center gap-10 lg:grid-cols-2 ${
                    item.imagePosition === "left" ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                >
                    {/* Content */}
                    <div
                    className={item.imagePosition === "left" ? "lg:order-2" : ""}
                    >
                    <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#FCE1D2]">
                        <img src={item.icon} alt={item.title} />
                    </div>

                    <h3 className="mt-5 text-[22px] font-bold leading-[30px] text-[#22201C] sm:text-[24px] sm:leading-[32px] lg:text-[26px] lg:leading-[26px]">
                        {item.title}
                    </h3>

                    <p className="mt-5 max-w-[530px] text-[15px] font-medium leading-6 text-[#4E4D49] sm:text-base sm:leading-[26px]">
                        {item.description}
                    </p>

                    <Link href="/about-us"
                        className="mt-[30px] inline-flex items-center gap-[10px] rounded-[62px] bg-primary px-[25px] py-[12px] text-lg !leading-[18px] font-semibold text-white transition-all duration-300"
                    >
                        Learn More
                        <img src='/assets/images/btn-right-errow.svg' alt="Arrow" />
                    </Link>
                    </div>

                    {/* Image */}
                    <div
                    className={item.imagePosition === "left" ? "lg:order-1" : ""}
                    >
                    <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full rounded-[20px] object-cover"
                    />
                    </div>
                </div>
                </motion.div>
            ))}
            </div>
        </div>
      </section>
    </>
  );
}

export default WhyBuy;
