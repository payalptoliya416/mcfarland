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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
interface ProductSliderProps {
  data: SingleMachinery;
}

export default function ProductSlider({ data }: ProductSliderProps) {
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const media = data.images ?? [];
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  
  const photos = media.filter((m) => m.type === "image");
  const videos = media.filter((m) => m.type === "video");

  const activeMedia = activeTab === "photos" ? photos : videos;

  return (
    <>
    <div className="group">
      {/* ================= MAIN SLIDER ================= */}
    <div className="relative border border-border rounded-[15px] mb-[25px] overflow-hidden">
 <Swiper
  modules={[Navigation, Thumbs]}
  thumbs={{ swiper: thumbsSwiper }}
  navigation={{
    prevEl: prevRef.current,
    nextEl: nextRef.current,
  }}
  onBeforeInit={(swiper: any) => {
    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
  }}
>
  {activeMedia.length > 0 ? (
    activeMedia.map((item) => (
      <SwiperSlide
        key={item.id}
        className="cursor-grab active:cursor-grabbing"
      >
        <div className="relative w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[500px]">
          {item.type === "image" ? (
            <Image
              src={item.full_url}
              alt={data.name}
              fill
              priority
              sizes="(max-width:700px)100vw,623px"
              className="object-cover rounded-[15px]"
            />
          ) : (
            <video
              src={item.full_url}
              controls
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </SwiperSlide>
    ))
  ) : (
    <SwiperSlide>
      <div className="flex h-[220px] sm:h-[320px] md:h-[420px] lg:h-[500px] items-center justify-center rounded-[15px] bg-gray-100 text-gray-500">
        No {activeTab === "photos" ? "Image" : "Video"} Available
      </div>
    </SwiperSlide>
  )}
</Swiper>

  {/* Navigation */}
  <div className="absolute bottom-5 right-5 z-20 flex gap-[10px]">
    <button
      ref={prevRef}
      className="h-[44px] w-[44px] rounded-full bg-white shadow-lg flex items-center justify-center transition hover:bg-primary hover:text-white cursor-pointer"
    >
      <ChevronLeft size={20} />
    </button>

    <button
      ref={nextRef}
      className="h-[44px] w-[44px] rounded-full bg-white shadow-lg flex items-center justify-center transition hover:bg-primary hover:text-white cursor-pointer"
    >
      <ChevronRight size={20} />
    </button>
  </div>
</div>

      {/* ================= TABS ================= */}
     <div className="flex overflow-hidden w-full mb-5 gap-[17px]">
  <button
    onClick={() => setActiveTab("photos")}
    className={`w-1/2 h-[36px] sm:h-[42px] rounded-full text-base sm:text-lg sm:leading-[18px] font-medium transition-all duration-300 cursor-pointer ${
      activeTab === "photos"
        ? "bg-green text-white hover:bg-[#E9E9E9CC] hover:text-[#343231]"
        : "bg-[#E9E9E9CC] text-[#343231] "
    }`}
  >
    Photos
  </button>

  <button
    onClick={() => setActiveTab("videos")}
    className={`w-1/2 h-[36px] sm:h-[42px] rounded-full text-base sm:text-lg sm:leading-[18px] font-medium transition-all duration-300 cursor-pointer ${
      activeTab === "videos"
        ? "bg-green text-white"
        : "bg-[#E9E9E9CC] text-[#343231] hover:bg-green hover:text-white"
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
        className="mb-10 relative rounded-xl"
        breakpoints={{
          0: { slidesPerView: 2 },
          480: { slidesPerView: 3 },
          678: { slidesPerView: 5 },
        }}
      >
        {activeMedia.map((item) => (
          <SwiperSlide key={item.id} className="thumb-slide">
            <div className="relative border border-border w-full h-[98px] md:w-[128px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300" >
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
