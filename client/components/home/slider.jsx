"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { fetchSlider } from "@/api/slider.api";

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
                src={
                  slide.image
                    ? `${process.env.NEXT_PUBLIC_API_IMAGE_URL}${slide.image}`
                    : "/images/default-slide.png"
                }
                alt={slide.name}
                fill
                priority
                className="object-cover z-0"
              />
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
