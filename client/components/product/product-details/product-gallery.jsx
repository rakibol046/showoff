"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function ProductGallery({ images, productName, discount }) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={
            images[currentImage]
              ? `${process.env.NEXT_PUBLIC_API_IMAGE_URL}${images[currentImage]}`
              : "/images/default-slide.png"
          }
          alt={`${productName} - Image ${currentImage + 1}`}
          width={800}
          height={800}
          className="w-full h-full object-cover"
        />

        {discount > 0 && (
          <Badge className="absolute top-4 left-4 bg-red-500 text-white">
            -{discount}% OFF
          </Badge>
        )}

        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {images?.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              currentImage === index
                ? "border-blue-600 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Image
              src={
                image
                  ? `${process.env.NEXT_PUBLIC_API_IMAGE_URL}${image}`
                  : "/images/default-slide.png"
              }
              alt={`Thumbnail ${index + 1}`}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
