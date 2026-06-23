"use client";

import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addToCart } from "@/store/cartStore";
import useWishlist from "@/hooks/useWishlist";
import { symbol } from "@/lib/currency";

export default function ProductInfo({ product }) {
  const colors = product.colors || [];
  const sizes = product.sizes || [];

  const [selectedColor, setSelectedColor] = useState(colors[0]?._id || "");
  const [selectedSize, setSelectedSize] = useState(sizes[0]?.name || "");
  const [quantity, setQuantity] = useState(1);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const wished = isInWishlist(product._id);

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const handleAddToCart = () => {
    const colorObj = colors.find((c) => c._id === selectedColor);
    addToCart(
      {
        _id: product._id,
        slug: product.slug,
        name: product.name,
        sell_price: product.sell_price,
        image: product.images?.[0],
      },
      quantity,
      colorObj?.name || "",
      selectedSize
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-4xl font-bold text-gray-900">
            {symbol} {product?.sell_price}
          </span>
        </div>

        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Color:{" "}
            <span className="font-normal text-gray-600">
              {colors.find((c) => c._id === selectedColor)?.name}
            </span>
          </label>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color._id}
                onClick={() => setSelectedColor(color._id)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color._id
                    ? "border-blue-600 ring-2 ring-blue-200 scale-110"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color?.hex }}
                aria-label={`Select ${color?.name}`}
                title={color?.name}
              />
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Size
          </label>
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => (
                <SelectItem key={size._id} value={size.name}>
                  {size.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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

      <div className="flex gap-3">
        <Button
          className="flex-1 h-12 text-base font-semibold"
          disabled={!product?.stock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12"
          onClick={() => toggleWishlist(product)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-5 h-5 ${wished ? "fill-red-500 text-red-500" : ""}`}
          />
        </Button>
      </div>
    </div>
  );
}
