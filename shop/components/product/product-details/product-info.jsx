"use client";

import { useState } from "react";
import { Star, Heart, Share2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductInfo({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0].value);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0].name);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product?.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm font-medium text-gray-700">
              {product?.rating}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            ({product?.reviews} reviews)
          </span>
        </div>

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-4xl font-bold text-gray-900">
            {process.env.NEXT_PUBLIC_CURRENCY} {product?.sell_price}
          </span>
          {/* {product?.originalPrice > product?.sell_price && (
            <span className="text-xl text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )} */}
        </div>

        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Color:{" "}
          <span className="font-normal text-gray-600">
            {product?.colors?.find((c) => c.value === selectedColor)?.name}
          </span>
        </label>
        <div className="flex gap-3">
          {product?.colors?.map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={`w-12 h-12 rounded-full border-2 transition-all ${
                selectedColor === color.value
                  ? "border-blue-600 ring-2 ring-blue-200 scale-110"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color?.hex }}
              aria-label={`Select ${color?.name}`}
            />
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Size
        </label>
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {product?.sizes?.map((size) => (
              <SelectItem key={size._id} value={size.name}>
                {size.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={decrementQuantity}
              className="px-4 py-2 hover:bg-gray-100 transition-colors rounded-l-lg"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-6 py-2 font-semibold border-x border-gray-300">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              className="px-4 py-2 hover:bg-gray-100 transition-colors rounded-r-lg"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-600">
            {product.stock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          className="flex-1 h-12 text-base font-semibold"
          disabled={!product?.stock}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart
            className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
          />
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12">
          <Share2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
