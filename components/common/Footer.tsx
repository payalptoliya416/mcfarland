"use client";

import Image from "next/image";
import Link from "next/link";
import { useSettings } from "@/contexts/SettingsContext";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";
import { IoCallOutline, IoTimeOutline } from "react-icons/io5";
import { LuMail } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "./Loader";

function Footer() {
  const { settings, companyName } = useSettings();
  const router = useRouter();
  const [redirectLoading, setRedirectLoading] = useState(false);

  const handleRedirect = (path: string) => {
    setRedirectLoading(true);
    router.push(path);
  };
  const pathname = usePathname();
  useEffect(() => {
    setRedirectLoading(false);
  }, [pathname]);

  return (
    <>
      {redirectLoading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <Loader />
        </div>
      )}
      <section className="bg-[url(/assets/ready-bg2-new.png)] lg:bg-[url(/assets/ready-bg01-new .png)] 2xl:bg-[url(/assets/ready-bg-new.png)] bg-no-repeat w-full h-full mt-20 lg:mt-[110px] py-[60px] bg-position">
        <div className="grid grid-cols-12 container-custom mx-auto">
          <div className="col-span-12 sm:col-span-10 md:col-span-7 xl:col-span-5 2xl:col-span-4">
            <h3 className="text-white text-3xl md:text-[38px] md:leading-[55px] font-bold mb-[15px] mont-text">
              Ready to Buy or Sell Equipment Today?
            </h3>
            <p className=" text-white text-base leading-[26px] mb-[30px] pr-10">
              Join thousands of satisfied customers who trust {companyName}
              for industrial and agricultural machinery.
            </p>
            <button
              onClick={() => handleRedirect("/inventory")}
              className="group relative overflow-hidden text-gray bg-white py-[14px] px-[22px] rounded-lg 
                      text-base leading-[16px] font-semibold mont-text border-none transition-all duration-300"
            >
              <span className="relative z-10">Start Now</span>

              <span
                className="absolute inset-0 bg-green/20 translate-x-[-100%] 
                        group-hover:translate-x-[100%] transition-all duration-500"
              ></span>
            </button>
          </div>
        </div>
      </section>
      <footer className="bg-gray py-[50px] ">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-12 pb-[42px] border-b border-para">
            <div className="col-span-12 lg:col-span-4 mb-10 lg:mb-0">
              <Link href="/">
                {settings?.white_logo && (
                  <Image
                    src={`${settings.white_logo}`}
                    alt={settings.company_name}
                    height={90}
                    width={178}
                    className="mb-[30px]"
                  />
                )}
              </Link>
              <p className="text-light-gray text-base leading-[26px] mb-[30px] w-full">
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
                    <FaFacebookF className="text-light-gray group-hover:text-green" />
                  </a>
                )}

                {settings?.twitter && (
                  <a
                    href={settings.twitter}
                    target="_blank"
                    className="group border border-border w-7 h-7 rounded-full flex justify-center items-center 
               transition-all duration-300 hover:border-green hover:bg-green/10 hover:scale-110"
                  >
                    <FaXTwitter className="text-light-gray group-hover:text-green" />
                  </a>
                )}

                {settings?.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    className="group border border-border w-7 h-7 rounded-full flex justify-center items-center 
               transition-all duration-300 hover:border-green hover:bg-green/10 hover:scale-110"
                  >
                    <FaInstagram className="text-light-gray group-hover:text-green" />
                  </a>
                )}

                {settings?.linkedin && (
                  <a
                    href={settings.linkedin}
                    target="_blank"
                    className="group border border-border w-7 h-7 rounded-full flex justify-center items-center 
               transition-all duration-300 hover:border-green hover:bg-green/10 hover:scale-110"
                  >
                    <FaLinkedinIn className="text-light-gray group-hover:text-green" />
                  </a>
                )}
              </div>
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4 flex lg:justify-center mb-10 sm:mb-0">
              <div>
                <h3 className="text-orange mb-5 text-lg leading-[18px] mont-text font-semibold">
                  Quick Links
                </h3>

                <ul className="space-y-[15px]">
                  <li>
                    <button
                      onClick={() => handleRedirect("/")}
                      className="relative text-light-gray text-base leading-[16px] font-normal group cursor-pointer"
                    >
                      Home
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => handleRedirect("/inventory")}
                      className="relative text-light-gray text-base leading-[16px] font-normal group cursor-pointer"
                    >
                      Inventory
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => handleRedirect("/about-us")}
                      className="relative text-light-gray text-base leading-[16px] font-normal group cursor-pointer"
                    >
                      About
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => handleRedirect("/faq")}
                      className="relative text-light-gray text-base leading-[16px] font-normal group cursor-pointer"
                    >
                      FAQ
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => handleRedirect("/contact-us")}
                      className="relative text-light-gray text-base leading-[16px] font-normal group cursor-pointer"
                    >
                      Contact
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
              <h3 className="text-orange mb-5 text-lg leading-[18px] mont-text  font-semibold">
                Contact Info
              </h3>

              <a
                href={`tel:${settings?.phone_no}`}
                className="group block mb-5 transition-all duration-300"
              >
                <div className="flex gap-3 items-center">
                  <div>
                    <div className="flex justify-center items-center w-10 h-10 rounded-full bg-white/10 group-hover:bg-green">
                      <IoCallOutline className="text-white" />
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
                    <div className="flex justify-center items-center w-10 h-10 rounded-full bg-white/10 group-hover:bg-green">
                      <GrLocation className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-light-gray group-hover:text-white">
                    {settings?.company_name} {settings?.address}
                  </h3>
                </div>
              </a>

              <a
                href={`mailto:${settings?.email}`}
                className="group block mb-5"
              >
                <div className="flex gap-3 items-center">
                  <div>
                    <div className="flex justify-center items-center w-10 h-10 rounded-full bg-white/10 group-hover:bg-green">
                      <LuMail className="text-white" />
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
                      <IoTimeOutline className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-light-gray text-base transition-all duration-300 group-hover:text-white">
                    9am - 5pm Monday to Friday
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center 2xl:justify-between items-center pt-5 flex-wrap gap-4 text-center">
            <p className="text-light-gray text-base font-normal">
              <a
                href={process.env.NEXT_PUBLIC_WEBSITE_URL}
                className="text-orange font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                  mcfarland-equipment.com
              </a>{" "}
              is owned by MCFARLAND-EQUIPMENT, LLC Reg nº : (201702410607) -
              Copyright {new Date().getFullYear()} © All Rights Reserved
            </p>
            <p className="text-light-gray text-base font-normal">
              <Link href="/terms-condition" className="mr-1">
                Terms & services
              </Link>
              <span className="mx-3 text-light-gray">|</span>
              <Link href="/privacy-policy">Privacy policy</Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
