import React, { useState, useEffect } from "react";

const FashionLoader = () => {
  const icons = ["👕", "👖", "👗", "👟", "👒"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % icons.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative w-32 h-32">
        {/* Subtle elegant spinner */}
        <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-gray-300 animate-spin shadow-md shadow-gray-200/50" />

        {/* Center changing emoji */}
        <div className="absolute inset-0 flex items-center justify-center text-5xl text-black transition-opacity duration-300 ease-in-out animate-pulse">
          <span>{icons[currentIndex]}</span>
        </div>
      </div>
    </div>
  );
};

export default FashionLoader;
