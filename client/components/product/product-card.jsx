import React from "react";

const ProductCard = ({ image, name, price }) => {
  return (
    <div className="relative group overflow-hidden transition-all duration-300">
      {/* Image Wrapper with Aspect Ratio */}
      <div className="aspect-[3/4] overflow-hidden relative hover:cursor-pointer">
        {/* Love Button - visible on card hover, red on icon hover (hidden on mobile) */}
        <button className="absolute top-3 right-3 z-10 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="black"
            className="w-6 h-6 hover:cursor-pointer transition-all duration-300 hover:fill-red-500 hover:stroke-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 7.712a5.4 5.4 0 00-9.352-2.53L12 6.043l-.4-.86a5.4 5.4 0 00-9.352 2.53A5.401 5.401 0 003.6 13.5l8.4 7.45 8.4-7.45a5.401 5.401 0 001.352-5.788z"
            />
          </svg>
        </button>

        {/* Product Image */}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Quick View Overlay - hidden on mobile */}
        <div className="absolute bottom-0 w-full bg-black/60 text-white text-center py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          Quick View
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-semibold text-center text-sm">{name}</h3>
        <p className="text-center text-sm">Tk {price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
