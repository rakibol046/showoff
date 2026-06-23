"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getImgSrc } from "@/lib/imageUrl";
export default function VerticalSlider({ sliders = [] }) {
  return (
    <Swiper
      spaceBetween={0}
      centeredSlides
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper lg:-mt-[85px]"
    >
      {sliders.map((slide) => (
        <SwiperSlide key={slide._id}>
          <Link href={slide.link || "/"} className="block">
            <div className="relative h-[220px] md:h-[350px] lg:h-screen w-full">
              <Image
                src={getImgSrc(slide.image)}
                alt={slide.name || "Slide"}
                fill
                priority
                sizes="100vw"
                className="object-cover"
                onError={(e) => {
                  if (!e.currentTarget.dataset.errored) {
                    e.currentTarget.dataset.errored = "1";
                    e.currentTarget.src = getImgSrc(null);
                  }
                }}
              />
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
