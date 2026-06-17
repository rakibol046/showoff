import { ArrowRight } from "lucide-react";
import Link from "next/link";

const IMG_BASE = (process.env.NEXT_PUBLIC_API_IMAGE_URL || "").replace(/\/$/, "");

function catBg(logo_url) {
  if (!logo_url) return "none";
  if (logo_url.startsWith("http://") || logo_url.startsWith("https://")) return `url(${logo_url})`;
  return IMG_BASE ? `url(${IMG_BASE}/${logo_url.replace(/^\//, "")})` : "none";
}

export default function CategorySection({ categories = [] }) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-[#fbffff] dark:bg-background px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      <div className="text-center mb-10">
        <p className="font-asul text-3xl sm:text-4xl lg:text-5xl mb-3">Shop by Category</p>
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Discover our curated collection across different categories
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {categories.map((category, index) => (
          <Link
            key={category._id || index}
            href={`/products?parentcat=${encodeURIComponent(category.name)}`}
            className="group block"
          >
            <div
              className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-500"
              style={{ height: "clamp(160px, 25vw, 400px)" }}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: catBg(category.logo_url),
                  backgroundColor: "#d1d5db",
                }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              {/* Text content */}
              <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
                <div className="transform transition-all duration-500 group-hover:-translate-y-1">
                  <h3 className="text-lg sm:text-2xl font-bold text-white leading-tight mb-1">
                    {category.name}
                  </h3>
                  {category.note && (
                    <p className="text-gray-300 text-xs sm:text-sm mb-3 line-clamp-2 hidden sm:block">
                      {category.note}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-white text-xs sm:text-sm font-semibold">
                    Explore
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:opacity-90 transition-opacity duration-300 shadow-md"
        >
          View All Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
