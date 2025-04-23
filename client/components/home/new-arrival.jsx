"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { useRef } from "react";

import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";

const images = [
  { src: "/images/img1.webp", name: "Red Kurta", price: "$25" },
  { src: "/images/img2.webp", name: "Blue Kurta", price: "$30" },
  { src: "/images/img3.webp", name: "Green Kurta", price: "$28" },
  { src: "/images/img4.webp", name: "Yellow Kurta", price: "$26" },
  { src: "/images/img5.webp", name: "White Kurta", price: "$29" },
  { src: "/images/img2.webp", name: "Blue Kurta", price: "$30" },
  { src: "/images/img3.webp", name: "Green Kurta", price: "$28" },
  { src: "/images/img4.webp", name: "Yellow Kurta", price: "$26" },
];

export default function NewArrival() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="bg-[#F9F4EF] dark:bg-background p-6 sm:p-8 lg:p-12">
      <p className="font-asul text-3xl sm:text-4xl lg:text-5xl text-center mb-6">
        New Arrival
      </p>

      <div className="relative w-full">
        {/* Custom Navigation Buttons */}
        <div
          ref={prevRef}
          className="absolute h-10 w-10 text-md md:h-12 md:w-12 flex items-center justify-center md:text-2xl z-10 top-1/2 -translate-y-1/2 left-2 sm:left-4 bg-black/70 text-white p-2 sm:p-3 cursor-pointer rounded-full hover:bg-black transition"
        >
          ←
        </div>
        <div
          ref={nextRef}
          className="absolute h-10 w-10 text-md md:h-12 md:w-12 flex items-center justify-center md:text-2xl z-10 top-1/2 -translate-y-1/2 right-2 sm:right-4 bg-black/70 text-white p-2 sm:p-3  cursor-pointer rounded-full hover:bg-black transition"
        >
          →
        </div>

        <Swiper
          spaceBetween={12}
          pagination={{ clickable: true }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          modules={[Pagination, Navigation]}
          className="mySwiper"
          breakpoints={{
            320: { slidesPerView: 1 },
            480: { slidesPerView: 1.5 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {images.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="group relative w-full aspect-[3/4] rounded overflow-hidden shadow-md">
                <Link href={`/products`}>
                  <Image
                    src={item.src}
                    alt={`Slide ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </Link>
                {/* Overlay visible on hover for md+ and always visible on small */}
                <div
                  className="
                    absolute bottom-0 left-0 w-full px-4 py-3
                    bg-black/60 text-white  lg:text-base
                    transition-all duration-500 ease-in-out
                    lg:translate-y-full lg:opacity-0
                    group-hover:translate-y-0 group-hover:opacity-100
                  "
                >
                  <p className=" font-medium">{item.name}</p>
                  <p className="text-sm">{item.price}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
