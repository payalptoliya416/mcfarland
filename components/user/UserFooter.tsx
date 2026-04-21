"use client";

import Link from "next/link";

function UserFooter() {
  return (
    <div className="bg-gray ">
      <div className="py-12 container-custom mx-auto grid grid-cols-12 gap-4 lg:gap-5 sm:gap-1 items-center">
        <div className="text-center md:text-left col-span-12 xl:col-span-8">
          <p className="text-light-gray text-base font-normal text-center lg:text-left mb-3 lg:mb-0">
            <a
              href={process.env.NEXT_PUBLIC_WEBSITE_URL}
              className="text-orange font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
               mcfarland-equipment.com
            </a>{" "}
            is owned by  MCFARLAND-EQUIPMENT, LLC Reg nº : (201702410607) -
            Copyright {new Date().getFullYear()} © All Rights Reserved
          </p>
        </div>
        <div className="text-center md:text-left col-span-12 xl:col-span-4 flex items-center justify-center xl:justify-end gap-5 flex-col lg:flex-row">
          <div className="flex justify-center items-center">
            <Link
              href="/terms-condition"
              className="text-light-gray text-base leading-[16px] font-normal"
            >
              Terms & services
            </Link>

            <span className="mx-3 text-light-gray">|</span>

            <Link
              href="/privacy-policy"
              className="text-light-gray text-base leading-[16px] font-normal"
            >
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserFooter;
