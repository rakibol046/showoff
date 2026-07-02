"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { symbol } from "@/lib/currency";
import useWishlist from "@/hooks/useWishlist";
import { getImgSrc } from "@/lib/imageUrl";
import { Badge } from "@/components/ui/badge";
const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wished = isInWishlist(product._id);

  return (
    <div className="relative group overflow-hidden transition-all duration-300">
      <div className="aspect-[3/4] overflow-hidden relative hover:cursor-pointer">
       {product?.discount > 0 && (
          <Badge className="absolute top-4 left-4 bg-red-500 text-white z-10">
            -{product?.discount}% OFF
          </Badge>
        )}

        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 z-10 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-6 h-6 transition-all duration-300 ${
              wished ? "fill-red-500 stroke-red-500" : "stroke-black hover:fill-red-500 hover:stroke-red-500"
            }`}
          />
        </button>

        <Link href={`/product/${product.slug}`} className="block relative w-full h-full">
          <Image
            src={getImgSrc(product.image || product.images?.[0])}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 20vw"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { if (!e.currentTarget.dataset.errored) { e.currentTarget.dataset.errored = "1"; e.currentTarget.src = getImgSrc(null); } }}
          />
        </Link>

        <div className="absolute bottom-0 w-full bg-black/60 text-white text-center py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          Quick View
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-center text-sm">{product.name}</h3>
        <p className="text-center text-sm">
          {symbol} {product.sell_price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
