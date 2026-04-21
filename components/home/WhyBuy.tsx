import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GoArrowRight } from "react-icons/go";
import { useSettings } from "@/contexts/SettingsContext";

function WhyBuy() {
  const { companyName } = useSettings();
  return (
    <>
      <section className="container-custom mx-auto my-20 lg:my-[110px]">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-[38px] font-bold text-[#1D1C1A]">
            Why buy from <span className="text-green">{companyName}</span>?
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Easy & secure equipment transactions
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6">
            <div className="relative h-full rounded-2xl overflow-hidden">
              <img
                src="/assets/why2.png"
                alt="excavator"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="h-full bg-[#E9E9E940] rounded-2xl p-6 flex flex-col">
              <div className="w-[70px] h-[70px] flex items-center justify-center border border-border rounded-xl mb-6 bg-white">
                <Image src="/assets/w2-new.svg" alt="" width={40} height={40} />
              </div>

              <h3 className="text-lg font-bold mb-3 text-gray">
                Secure & Transparent Payments
              </h3>

              <p className="text-text-gray text-base leading-[26px] mb-6 flex-grow">
                Bid or Buy Now with complete confidence. All payments are securely
                processed with full transparency, clear pricing, and absolutely no
                hidden fees, ensuring a safe and reliable transaction every time.
              </p>

              <Link
                href="/about-us"
                className="text-base font-bold text-gray flex items-center gap-2 hover:text-primary group"
              >
                Learn More
                <span className="text-lg transition-transform group-hover:translate-x-1">
                  <GoArrowRight />
                </span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="h-full bg-[#E9E9E940] rounded-2xl p-6 flex flex-col">
              <div className="w-[70px] h-[70px] flex items-center justify-center border border-border rounded-xl mb-6 bg-white">
                <Image src="/assets/w1-new.svg" alt="" width={40} height={40} />
              </div>

              <h3 className="text-lg font-bold mb-3 text-gray">
                Fully Inspected Equipment
              </h3>

              <p className="text-text-gray text-base leading-[26px] mb-6 flex-grow">
                We provide clear images, accurate details, and honest condition
                information so you can buy with confidence.
              </p>

              <Link
                href="/about-us"
                className="text-base font-bold text-gray flex items-center gap-2 hover:text-primary group"
              >
                Learn More
                <span className="text-lg transition-transform group-hover:translate-x-1">
                  <GoArrowRight />
                </span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="h-full bg-[#E9E9E940] rounded-2xl p-6 flex flex-col">
              <div className="w-[70px] h-[70px] flex items-center justify-center border border-border rounded-xl mb-6 bg-white">
                <Image src="/assets/w3-new.svg" alt="" width={40} height={40} />
              </div>

              <h3 className="text-lg font-bold mb-3 text-gray">
                Delivered to Your Location
              </h3>

              <p className="text-text-gray text-base leading-[26px] mb-6 flex-grow">
                We handle logistics and transportation to ensure your equipment reaches
                your jobsite safely.
              </p>

              <Link
                href="/about-us"
                className="text-base font-bold text-gray flex items-center gap-2 hover:text-primary group"
              >
                Learn More
                <span className="text-lg transition-transform group-hover:translate-x-1">
                  <GoArrowRight />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default WhyBuy;
