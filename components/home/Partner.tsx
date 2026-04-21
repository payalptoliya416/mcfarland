"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

function Partner() {
  return (
    <section className="my-10 sm:my-20 lg:my-[110px] px-5 ">
      <div className="container-custom mx-auto bg-gray rounded-[20px] py-10 px-16">
        <h3 className="text-white text-center text-[30px] sm:text-[38px] sm:leading-[38px] mb-[35px] font-bold mont-text">
          Partners & Brands
        </h3>
         <Swiper
                  loop={true}
                  spaceBetween={20}
                  breakpoints={{
                    0: { slidesPerView: 2 },       // Mobile
                    480: { slidesPerView: 3 },     // Small Tablets
                    768: { slidesPerView: 4 },     // Tablets
                    1024: { slidesPerView: 5 },    // Desktop
                  }}
                  className="pt-2"
                >

          {["logo1", "logo2", "logo3", "logo4", "logo5","logo2","logo3"].map((item, index) => (
             <SwiperSlide key={index} className="flex justify-center">
               <Image
                 key={index}
                 src={`/assets/${item}.png`}
                 alt="brand"
                 width={0}
                 height={0}
                 unoptimized
                 className="h-auto w-auto max-w-[140px] md:max-w-[180px] xl:max-w-none mx-auto"
               />
             </SwiperSlide>
          ))}
                </Swiper>
     
      </div>
    </section>
  );
}

export default Partner;
