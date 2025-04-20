"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
// import "swiper/css/navigation";

export default function VerticalSlider() {
  const silders = [
    {
      _id: 1,
      image: "/images/slide1.svg",
      url: "/products",
    },
    {
      _id: 2,
      image: "/images/slide2.svg",
      url: "/products",
    },
    {
      _id: 3,
      image: "/images/slide3.svg",
      url: "/products",
    },
  ];
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
      className="mySwiper lg:-mt-[85px]"
    >
      {silders.map((silde) => (
        <SwiperSlide key={silde._id}>
          <Link href={silde.url}>
            <div className="relative h-[220px] md:h-[350px] lg:h-screen w-full  flex items-center justify-center">
              <Image
                src={silde.image}
                alt="slider img"
                fill
                className="object-cover z-0"
                priority
              />

              {/* <Link
                href="/products"
                className="z-50 text-center cursor-pointer text-white bg-black/40 px-4 py-6 rounded"
              >
                <h2 className="text-4xl md:text-6xl font-bold">Goosebumps</h2>
              </Link> */}
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
