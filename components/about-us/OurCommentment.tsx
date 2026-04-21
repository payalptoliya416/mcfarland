"use client";

import Image from "next/image"
import { useSettings } from "@/contexts/SettingsContext";

function OurCommentment() {
  const { companyName } = useSettings();

  return (
    <section className="container-custom mx-auto lg:my-[110px] my-10 sm:my-20">
      <div className="grid grid-cols-12 lg:gap-[30px] items-center mt-10">
        <div className="col-span-12 lg:col-span-6 order-2 lg:order-1 mb-5 lg:mb-0">
          <h2 className="text-[38px] leading-[40px] mb-[15px] font-bold text-gray mont-text">
            Our <span className="text-orange">Commitment</span>
          </h2>
          <p className="mb-[15px] text-[16px] leading-[26px] font-normal text-text-gray">
            At {companyName}, our commitment goes beyond just buying and selling machines - it's about building trust and long-term partnerships with every client we serve.
          </p>
          <p className="mb-[15px] text-[16px] leading-[26px] font-normal text-text-gray">
            We understand that every piece of equipment represents an important investment, and that's why we focus on providing a seamless, transparent, and customer-first experience from start to finish.
          </p>
          <p className="mb-[15px] text-[16px] leading-[26px] font-normal text-text-gray">
            Our dedicated team ensures that every listing is accurately described, carefully inspected, and fairly priced, giving you the confidence to make the right decision.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-6  order-1 lg:order-2 mb-5 lg:mb-0">
          <Image
            src="/assets/commetment.png"
            alt="about"
            width={575}
            height={445}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </section>
  )
}

export default OurCommentment
