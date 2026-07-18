"use client";

import Image from "next/image";

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

  return (
    <section className="container-custom mx-auto lg:mb-[110px] my-10 sm:my-20 lg:mt-[142px]">
      <div className="grid grid-cols-12 lg:gap-[30px] items-stretch mt-10">
           <div
          className="col-span-12 lg:col-span-6 mb-5 lg:mb-0"
        >
          {/* Heading */}
          <h2 className="mb-[25px] text-[30px] font-bold leading-[36px] sm:text-[36px] sm:leading-[38px] lg:text-[42px] lg:leading-[52px]">
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
          <div
            className="space-y-[15px]"
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 items-center"
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
                  <h3 className="text-base font-semibold text-lightblack">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
          <div
          className="col-span-12 lg:col-span-6 h-full mb-5 lg:mb-0"
        >
          <div className="block lg:hidden">
            <Image
              src="/assets/images/built.png"
              alt="about"
              width={575}
              height={445}
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>

          {/* Desktop Fill Image */}
          <div className="hidden lg:block relative w-full h-full overflow-hidden">
            <Image
              src="/assets/images/built.png"
              alt="about"
              fill
              className=""
            />
          </div>
        </div>
      
      </div>
    </section>
  );
}

export default TrustDriven;
