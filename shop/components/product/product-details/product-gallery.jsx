"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const IMG_BASE = (process.env.NEXT_PUBLIC_API_IMAGE_URL || "").replace(/\/$/, "");
const IMG_FALLBACK = "/images/default-product.webp";
function getImgSrc(path) {
  if (!path) return IMG_FALLBACK;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) return path;
  return IMG_BASE ? `${IMG_BASE}/${path.replace(/^\//, "")}` : IMG_FALLBACK;
}

export default function ProductGallery({ images = [], productName, discount }) {
  const [currentImage, setCurrentImage] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
        <Image
          src="/images/default-product.webp"
          alt={productName}
          width={800}
          height={800}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={getImgSrc(images[currentImage])}
          alt={`${productName} - Image ${currentImage + 1}`}
          width={800}
          height={800}
          className="w-full h-full object-cover"
          onError={(e) => { if (!e.currentTarget.dataset.errored) { e.currentTarget.dataset.errored = "1"; e.currentTarget.src = IMG_FALLBACK; } }}
        />

        {discount > 0 && (
          <Badge className="absolute top-4 left-4 bg-red-500 text-white">
            -{discount}% OFF
          </Badge>
        )}

        {images.length > 1 && (
          <>
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
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
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
                src={getImgSrc(image)}
                alt={`Thumbnail ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/default-product.webp";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
