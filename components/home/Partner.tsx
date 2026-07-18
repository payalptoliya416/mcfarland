"use client";

import Image from "next/image";
export interface BrandItem {
  id: number;
  logo: string;
  name: string;
}

const brandData: BrandItem[] = [
  {
    id: 1,
    logo: "/assets/images/brand1.png",
    name: "Caterpillar",
  },
  {
    id: 2,
    logo: "/assets/images/brand2.png",
    name: "JCB",
  },
  {
    id: 3,
    logo: "/assets/images/brand3.png",
    name: "John Deere",
  },
  {
    id: 4,
    logo: "/assets/images/brand4.png",
    name: "Volvo",
  },
  {
    id: 5,
    logo: "/assets/images/brand5.png",
    name: "CASE",
  },
];

function Partner() {
  return (
    <>
      <section className="section-space">
        <div className="container-custom">
          <h2 className="mb-10 text-[30px] font-extrabold leading-[36px] sm:text-[36px] sm:leading-[38px] lg:text-[42px] lg:leading-[52px] text-center">
            <span className="text-primary">Partners</span> & Brands
          </h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {brandData.map((brand) => (
              <div
                key={brand.id}
                className="flex h-[50px] lg:h-[66px] items-center justify-center rounded-full bg-white px-5 lg:px-8 shadow-[0_4px_25px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_35px_rgba(0,0,0,0.12)]"
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={0}
                  height={0}
                  sizes="100vw"
                  unoptimized
                  className="w-auto h-auto max-h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Partner;
