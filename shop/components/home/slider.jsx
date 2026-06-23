"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const IMG_BASE = (process.env.NEXT_PUBLIC_API_IMAGE_URL || "").replace(/\/$/, "");
const IMG_FALLBACK = "/images/default-slide.png";

function getImgSrc(path) {
  if (!path) return IMG_FALLBACK;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) return path;
  return IMG_BASE ? `${IMG_BASE}/${path.replace(/^\//, "")}` : IMG_FALLBACK;
}

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
                    e.currentTarget.src = IMG_FALLBACK;
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
