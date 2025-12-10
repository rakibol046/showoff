"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { getSlider } from "@/features/api/sliderApi";

export default function VerticalSlider({ sliders }) {
  return (
    <Swiper
      spaceBetween={0}
      centeredSlides={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      onSwiper={(swiper) => console.log(swiper)}
      className="mySwiper lg:-mt-[85px]"
    >
      {sliders?.map((slide) => (
        <SwiperSlide key={slide._id}>
          <Link href={slide.link}>
            <div className="relative h-[220px] md:h-[350px] lg:h-screen w-full  flex items-center justify-center">
              <Image
                src={`${
                  slide.image ? slide.image : "/images/default-slide.png"
                }`}
                // src={"/images/slider.webp"}
                alt="slider img"
                fill
                className="object-cover z-0"
                priority
              />
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
