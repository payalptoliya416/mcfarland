"use client";

import Image from "next/image";
import { useSettings } from "@/contexts/SettingsContext";
import Link from "next/link";

function AboutUs() {
  const { companyName } = useSettings();
  return (
    <>
      <section className="pt-[60px] lg:pt-[110px]">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-[30px]">
            <div
              className="flex justify-center lg:justify-start"
            >
              <Image
                src="/assets/images/about.png"
                alt="About Eastline Equipment"
                width={0}
                height={0}
                sizes="100vw"
                className="w-auto h-auto"
              />
            </div>
            <div
            >
              <span className="inline-flex rounded-full bg-[#F2671C] px-5 py-[10px] text-base !leading-[16px] font-semibold text-white">
                About Us
              </span>

              <h2 className="mt-5 max-w-[570px]  text-[32px] font-bold leading-[42px] text-[#22201C] sm:text-[36px] sm:leading-[46px] lg:text-[42px] lg:leading-[52px]">
                Powering the Future of{" "}
                <span className="text-primary">Equipment Trading</span>
              </h2>

              <div className="mt-[25px] space-y-[15px]">
                <p className="text-base font-medium !leading-[26px] text-[#4E4D49]">
                  At {companyName} , we specialize in the buying, selling, and
                  auctioning of high-quality industrial machinery, tractors,
                  farm tools, and construction equipment.
                </p>

                <p className="text-base font-medium !leading-[26px] text-[#4E4D49]">
                  Our mission is simple to connect trusted sellers with serious
                  buyers through a secure, transparent, and easy-to-use online
                  platform.
                </p>

                <p className="text-base font-medium !leading-[26px] text-[#4E4D49]">
                  Whether you’re looking to purchase your next machine or sell
                  your existing equipment, we provide the expertise, tools, and
                  exposure you need to make every transaction smooth and
                  successful.
                </p>
              </div>

              <Link
                href="/about-us"
                className="group mt-[30px] inline-flex items-center justify-center gap-[10px]
            rounded-[62px] bg-primary px-[25px] py-[12px]
            text-base sm:text-[17px] lg:text-[18px]
            font-semibold leading-[18px] text-white
            transition-all duration-300 ease-out
            hover:-translate-y-1
            hover:shadow-[0_12px_30px_rgba(242,103,28,0.35)]
            active:translate-y-[2px]
            active:scale-[0.97]"
              >
                <span>Read More</span>
                <Image
                  src="/assets/images/btn-right-errow.svg"
                  alt="Arrow"
                  width={18}
                  height={18}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-2"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutUs;
