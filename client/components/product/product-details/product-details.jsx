"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Minus, Plus, Heart, Share2 } from "lucide-react";

const ProductDetails = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const variant = product.variants.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    );
    setSelectedVariant(variant);
  }, [selectedSize, selectedColor, product.variants]);

  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = [...new Set(product.variants.map((v) => v.color))];

  const imagesToShow = selectedVariant?.image
    ? [selectedVariant.image]
    : product.product_images.length > 0
    ? product.product_images
    : [product.thumbnail];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 max-w-7xl mx-auto">
      <div className="w-full">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          className="rounded-2xl overflow-hidden"
        >
          {imagesToShow.map((img, i) => (
            <SwiperSlide key={i}>
              <Image
                src={img}
                alt={`product image ${i}`}
                width={600}
                height={700}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-lg">
          ৳ {selectedVariant?.sell_price || product.sell_price}
        </p>

        <div>
          <label className="font-semibold text-sm block mb-1">Quantity</label>
          <div className="flex items-center border border-gray-300 w-fit">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2"
            >
              <Minus size={16} />
            </button>
            <div className="px-4 py-2 border-x border-gray-300">{quantity}</div>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-sm block mb-1">Size</label>
            <Select
              value={selectedSize}
              onValueChange={(size) => setSelectedSize(size)}
            >
              <SelectTrigger className="w-full">
                {selectedSize || "Choose an Option..."}
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="font-semibold text-sm block mb-1">
              Cut / Fit
            </label>
            <Select
              value={selectedColor}
              onValueChange={(color) => setSelectedColor(color)}
            >
              <SelectTrigger className="w-full">
                {selectedColor || "Choose an Option..."}
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t pt-4 mt-4 text-sm divide-y">
          <div className="py-2 cursor-pointer">Size Guide</div>
          <div className="py-2 cursor-pointer">Product Code</div>
          <div className="py-2 cursor-pointer">Product Description</div>
          <div className="py-2 cursor-pointer">Reviews</div>
        </div>

        <div className="mt-6">
          <p className="font-semibold mb-2 uppercase text-sm">Find in store</p>
          <div className="flex items-center gap-2">
            <Button className="bg-black text-white px-10 py-3 rounded-none hover:bg-black/90">
              ADD TO BAG
            </Button>
            <button className="p-3 border">
              <Heart size={18} />
            </button>
            <button className="p-3 border">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
