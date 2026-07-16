"use client";

import { useSettings } from "@/contexts/SettingsContext";

function ContactUs() {
  const { companyName } = useSettings();

  return (
    <>
    <section className="p-5 -mt-[145px]  pb-0">
      <div
        className="relative rounded-3xl overflow-hidden min-h-[410px] bg-cover bg-center bg-[url(/assets/images/contact-bg.png)] flex justify-center items-center md:bg-[length:100%_100%] bg-no-repeat"
      >
        <div className="relative z-10 pt-[132px] md:pt-[127px] pb-14 md:pb-[67px]">
          <div className="custom-container text-center text-white">
            <h1 className="mx-auto max-w-5xl text-center text-[28px] font-extrabold leading-[40px] sm:text-[42px] sm:leading-[52px] md:text-[48px] md:leading-[58px] lg:text-[60px] lg:leading-[72px] mb-5">
             
              <span className="text-primary">
                Get in Touch 
              </span>{" "}
              <span className="block lg:inline">with {companyName}</span>
            </h1>

            <p className="mx-auto max-w-[790px] px-4 text-center text-sm font-medium leading-6 text-white sm:text-base sm:leading-[26px]">
            Buy or Bid on high-quality machinery, tractors, and tools from trusted sellers. Whether you're expanding your fleet or upgrading your equipment, {companyName} has you covered.
            </p>
          </div>
        </div>

      </div>
    </section>
    </>
  );
}

export default ContactUs;
