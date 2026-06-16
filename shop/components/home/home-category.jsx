"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CategorySection({ categories }) {
  return (
    <section className="bg-[#fbffff] dark:bg-background p-6 sm:p-8 lg:p-12">
      <div className="text-center mb-12">
        <p className="font-asul text-3xl sm:text-4xl lg:text-5xl text-center mb-6">
          Shop by Category
        </p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our curated collection across different categories
        </p>
      </div>

      <div className="grid grid-cols-2  lg:grid-cols-3 gap-2">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={`/products?parentcat=${category?.name}`}
            className="group"
          >
            <Card
              key={index}
              className="group py-0 cursor-pointer border-0 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 rounded"
            >
              <div className="relative h-50 lg:h-100 overflow-hidden">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_API_IMAGE_URL}${category.logo_url})`,
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="transform transition-all duration-500 group-hover:-translate-y-2">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {category.name}
                    </h3>

                    <p className="text-gray-200 text-sm mb-4 line-clamp-2 opacity-90">
                      {category.note}
                    </p>

                    <div className="flex items-center text-white font-semibold text-sm group-hover:gap-3 gap-2 transition-all duration-300">
                      <span>Explore Now</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/20 transition-all duration-500 rounded" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No categories available at the moment.
          </p>
        </div>
      )}

      {categories.length > 0 && (
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
          >
            View All Products
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      )}
    </section>
  );
}
