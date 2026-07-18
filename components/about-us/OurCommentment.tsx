"use client";

import { useSettings } from "@/contexts/SettingsContext";

function OurCommitment() {
  const { companyName } = useSettings();

  return (
    <section className="">
      <div
        className="relative overflow-hidden rounded-[15px] bg-cover md:bg-[length:100%_100%] bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/assets/images/commitment-bg.png')", 
        }}
      >

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-[980px] px-6 py-16 text-center sm:px-10 lg:px-16 lg:py-[70px]">
          <h2 className="mb-5 text-[30px] font-bold leading-[36px] sm:text-[36px] sm:leading-[38px] lg:text-[42px] lg:leading-[52px] text-white">
            Our <span className="text-primary">Commitment</span>
          </h2>

          <p className="mb-6 text-base leading-7 text-white">
            At {companyName}, our commitment goes beyond just buying and
            selling machines - it's about building trust and long-term
            partnerships with every client we serve.
          </p>

          <p className="mb-6 text-base leading-7 text-white">
            We understand that every piece of equipment represents an important
            investment, and that's why we focus on providing a seamless,
            transparent, and customer-first experience from start to finish.
          </p>

          <p className="text-base leading-7 text-white">
            Our dedicated team ensures that every listing is accurately
            described, carefully inspected, and fairly priced, giving you the
            confidence to make the right decision.
          </p>
        </div>
      </div>
    </section>
  );
}

export default OurCommitment;