"use client";

import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { SingleMachinery } from "@/types/apiType";
import "swiper/css";
import "swiper/css/navigation";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
interface ProductSliderProps {
  data: SingleMachinery;
}

export default function ProductSlider({ data }: ProductSliderProps) {
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const media = data.images ?? [];

  // ✅ FILTER BY TYPE
  const photos = media.filter((m) => m.type === "image");
  const videos = media.filter((m) => m.type === "video");

  const activeMedia = activeTab === "photos" ? photos : videos;

  return (
    <>
    <div className="group">
      {/* ================= MAIN SLIDER ================= */}
      <div className="border border-border  rounded-[15px] mb-[25px]">
        <Swiper
          modules={[Navigation, Thumbs]}
          thumbs={{ swiper: thumbsSwiper }}
        >
          {activeMedia.map((item) => (
            <SwiperSlide
              key={item.id}
              className="cursor-grab active:cursor-grabbing"
            >
              <div
                className="
          w-full
          max-w-[623px]
          mx-auto
         h-[220px]
        sm:h-[320px]
        md:h-[420px]
        lg:h-[500px]
          rounded-xl
          overflow-hidden
          flex items-center justify-center
        "
              >
                {/* IMAGE */}
                {item.type === "image" && (
                  <Image
                    src={item.full_url}
                    alt={data.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 623px"
                    priority
                    className="w-full h-full object-cover rounded-[12px]"
                  />
                )}

                {item.type === "video" && (
                  <video
                    src={item.full_url}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex border rounded-xl overflow-hidden w-full border-border mb-[25px]">
        <button
          onClick={() => setActiveTab("photos")}
          className={`w-1/2 py-2 sm:py-3 font-medium transition-all ${
            activeTab === "photos"
              ? "bg-green text-white"
              : "bg-white text-gray hover:bg-light-gray/20 hover:text-green"
          }`}
        >
          Photos
        </button>

        <button
          onClick={() => setActiveTab("videos")}
          className={`w-1/2 py-2 sm:py-3 font-medium transition-all ${
            activeTab === "videos"
              ? "bg-green text-white"
              : "bg-white text-gray hover:bg-light-gray/20 hover:text-green"
          }`}
        >
          Videos
        </button>
      </div>

      {/* ================= THUMBNAILS ================= */}
      <Swiper
        modules={[Thumbs, Navigation]}
        onSwiper={setThumbsSwiper}
        slidesPerView={6}
        spaceBetween={10}
        watchSlidesProgress
        navigation={{
          nextEl: ".thumb-next",
          prevEl: ".thumb-prev",
        }}
        className="mb-[30px] relative rounded-xl"
        breakpoints={{
          0: { slidesPerView: 2 },
          480: { slidesPerView: 4 },
          640: { slidesPerView: 5 },
          1024: { slidesPerView: 6 },
        }}
      >
        {activeMedia.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              className="
            relative
            border border-border
            w-full h-[98px]
            2xl:w-[130px] 2xl:h-[130px]
            rounded-xl overflow-hidden
            cursor-pointer
          "
            >
              {item.type === "image" && (
                <Image
                  src={item.full_url}
                  alt="thumb"
                  fill
                  className="object-cover"
                />
              )}

              {item.type === "video" && (
                <video
                  src={item.full_url}
                  muted
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
        {/* PREV */}
      <div
  className="thumb-prev absolute left-0 top-1/2 -translate-y-1/2 z-20
  h-full w-8 flex items-center justify-center rounded-l-xl
  bg-gray-100 shadow-md cursor-pointer
  xl:opacity-0 xl:-translate-x-full
  group-hover:opacity-100 xl:group-hover:translate-x-0
  transition-all duration-100 ease-out"
>
  <MdChevronLeft size={22} />
</div>

        {/* NEXT */}
<div
  className="thumb-next absolute right-0 top-1/2 -translate-y-1/2 z-20
  h-full w-8 flex items-center justify-center rounded-r-xl
  bg-gray-100 shadow-md cursor-pointer
  xl:opacity-0 xl:translate-x-full
  group-hover:opacity-100 xl:group-hover:translate-x-0
  transition-all duration-100 ease-out"
>
  <MdChevronRight size={22} />
</div>
      </Swiper>
    </div>
    </>
  );
}
