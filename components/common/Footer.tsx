"use client";

import Link from "next/link";
import { useSettings } from "@/contexts/SettingsContext";
import Image from "next/image";

function Footer() {
  const { settings, companyName } = useSettings();

  return (
    <>
      <section className="">
        <div
          className="relative overflow-hidden bg-no-repeat"
          style={{
            backgroundImage: `url(/assets/images/ready-banner.png)`,
            backgroundSize: "100% 100%",
          }}
        >
          {/* Content */}
          <div className="relative z-10 flex min-h-[320px] flex-col items-center justify-center py-[50px] text-center container-custom">
            <h2 className="mx-auto text-center font-nunito text-[30px] font-extrabold leading-[38px] text-white sm:text-[36px] sm:leading-[46px] lg:text-[42px] lg:leading-[52px]">
              Ready to{" "}
              <span className="text-primary">Buy or Sell Equipment</span> Today?
            </h2>

            <p className="mt-[10px] max-w-[650px] font-nunito text-base font-medium leading-[28px] text-white/90">
              Join thousands of satisfied customers who trust {companyName} for
              industrial and agricultural machinery.
            </p>

            <Link
              href="/inventory"
              className="group mt-8 inline-flex items-center justify-center gap-[10px]
              rounded-[62px] bg-primary px-[25px] py-3
              font-nunito text-base font-semibold leading-none text-white
              transition-all duration-300 ease-out
              hover:-translate-y-1
              hover:scale-[1.02]
              hover:shadow-[0_12px_30px_rgba(242,103,28,0.35)]
              active:translate-y-[2px]
              active:scale-[0.98]
              active:shadow-[0_4px_10px_rgba(242,103,28,0.25)]"
            >
              <span> Start Now </span>
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
      </section>
      <footer className="bg-gray">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.6fr] gap-y-10 gap-x-8 xl:gap-x-14 pb-[42px] border-b border-para py-[40px] ">
            <div className="">
              <Link href="/">
                {settings?.white_logo && (
                  <Image
                    src={settings.white_logo}
                    alt={settings.company_name || "Logo"}
                    width={180}
                    height={60}
                    className="mb-5 h-auto w-auto"
                    unoptimized
                  />
                )}
              </Link>
              <p className="text-light-gray text-base leading-[26px] mb-[40px] w-full">
                {settings?.company_name} is your trusted marketplace for buying,
                selling, and auctioning quality industrial machinery, tractors,
                and tools.
              </p>
              <div className="flex items-center gap-[15px]">
                {settings?.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    className="group border border-border w-7 h-7 rounded-full flex justify-center items-center 
               transition-all duration-300 hover:border-green hover:bg-green/10 hover:scale-110"
                  >
                    <Image
                      src="/assets/images/facebook.svg"
                      alt="Facebook"
                      width={14}
                      height={14}
                    />
                  </a>
                )}

                {settings?.twitter && (
                  <a
                    href={settings.twitter}
                    target="_blank"
                    className="group border border-border w-7 h-7 rounded-full flex justify-center items-center 
               transition-all duration-300 hover:border-green hover:bg-green/10 hover:scale-110"
                  >
                    <Image
                      src="/assets/images/meta.svg"
                      alt="Meta"
                      width={14}
                      height={14}
                    />
                  </a>
                )}

                {settings?.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    className="group border border-border w-7 h-7 rounded-full flex justify-center items-center 
               transition-all duration-300 hover:border-green hover:bg-green/10 hover:scale-110"
                  >
                    <Image
                      src="/assets/images/insta.svg"
                      alt="Instagram"
                      width={14}
                      height={14}
                    />
                  </a>
                )}

                {settings?.linkedin && (
                  <a
                    href={settings.linkedin}
                    target="_blank"
                    className="group border border-border w-7 h-7 rounded-full flex justify-center items-center 
               transition-all duration-300 hover:border-green hover:bg-green/10 hover:scale-110"
                  >
                    <Image
                      src="/assets/images/linkdin.svg"
                      alt="LinkedIn"
                      width={14}
                      height={14}
                    />
                  </a>
                )}
              </div>
            </div>
            <div className="lg:mx-auto">
              <div>
                <h3 className="text-orange mb-5 text-lg leading-[18px] font-semibold">
                  Quick Links
                </h3>

                <ul className="space-y-[15px]">
                  <li>
                    <Link
                      href="/"
                      className="relative text-light-gray text-base leading-[16px] font-normal group cursor-pointer"
                    >
                      Home
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/inventory"
                      className="relative text-light-gray text-base leading-[16px] font-normal group cursor-pointer"
                    >
                      Inventory
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about-us"
                      className="relative text-light-gray text-base leading-[16px] font-normal group cursor-pointer"
                    >
                      About
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="relative text-light-gray text-base leading-[16px] font-normal group cursor-pointer"
                    >
                      FAQ
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact-us"
                      className="relative text-light-gray text-base leading-[16px] font-normal group cursor-pointer"
                    >
                      Contact
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="lg:mx-auto">
              <div>
                <h3 className="text-orange mb-5 text-lg leading-[18px] font-semibold">
                  Services
                </h3>

                <ul className="space-y-[15px]">
                  <li>
                    <Link
                      href="/terms-condition"
                      className="relative text-light-gray text-base leading-[16px] font-normal group cursor-pointer"
                    >
                      Terms & services
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="relative text-light-gray text-base leading-[16px] font-normal group cursor-pointer"
                    >
                      Privacy policy
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-orange mb-5 text-lg leading-[18px]  font-semibold">
                Contact Info
              </h3>

              <a
                href={`tel:${settings?.phone_no}`}
                className="group block mb-5 transition-all duration-300"
              >
                <div className="flex gap-3 items-center">
                  <div>
                    <div className="flex justify-center items-center w-10 h-10 rounded-full bg-white/10 group-hover:bg-primary">
                      <Image
                        src="/assets/images/call.svg"
                        alt="Call"
                        width={18}
                        height={18}
                      />
                    </div>
                  </div>
                  <h3 className="text-light-gray group-hover:text-white">
                    {settings?.phone_no}
                  </h3>
                </div>
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  settings?.address ?? "",
                )}`}
                target="_blank"
                className="group block mb-5"
              >
                <div className="flex gap-3 items-center">
                  <div>
                    <div className="flex justify-center items-center w-10 h-10 rounded-full bg-white/10 group-hover:bg-primary">
                      <Image
                        src="/assets/images/location.svg"
                        alt="Location"
                        width={18}
                        height={18}
                      />
                    </div>
                  </div>
                  <h3 className="text-light-gray group-hover:text-white">
                    {settings?.company_name} , {settings?.address}
                  </h3>
                </div>
              </a>

              <a
                href={`mailto:${settings?.email}`}
                className="group block mb-5"
              >
                <div className="flex gap-3 items-center">
                  <div>
                    <div className="flex justify-center items-center w-10 h-10 rounded-full bg-white/10 group-hover:bg-primary">
                      <Image
                        src="/assets/images/mail.svg"
                        alt="Mail"
                        width={18}
                        height={18}
                      />
                    </div>
                  </div>
                  <h3 className="text-light-gray group-hover:text-white">
                    {settings?.email}
                  </h3>
                </div>
              </a>

              <div className="group transition-all duration-300">
                <div className="flex gap-3 items-center">
                  <div>
                    <div
                      className="flex justify-center items-center w-10 h-10 rounded-full bg-white/10
                     transition-all duration-300 group-hover:bg-green group-hover:scale-110"
                    >
                      <Image
                        src="/assets/images/clock.svg"
                        alt="Clock"
                        width={18}
                        height={18}
                      />
                    </div>
                  </div>
                  <h3 className="text-light-gray text-base transition-all duration-300 group-hover:text-white">
                    9am - 4pm (MDT) Monday to Friday
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center py-5 flex-wrap gap-4 text-center">
            <p className="text-light-gray text-base font-normal">
              <a
                href={process.env.NEXT_PUBLIC_WEBSITE_URL}
                className="text-orange font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                eastline equipment auctions.com
              </a>{" "}
              is owned by Eastline Equipment, LLC Reg nº : (20151800734) -
              Copyright {new Date().getFullYear()} © All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
