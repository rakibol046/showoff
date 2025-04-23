"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

const categories = [
  {
    title: "Men",
    subcat: ["Shirts", "Shoes", "Accessories"],
  },
  {
    title: "Women",
    subcat: ["Dresses", "Heels", "Handbags"],
  },
  {
    title: "Kids",
    subcat: ["T-Shirts", "Shorts", "Sneakers"],
  },
];

const colors = ["Red", "Blue", "Black", "White", "Green"];
const sizes = ["S", "M", "L", "XL"];

const ProductsFilter = () => {
  const [selectedSubcats, setSelectedSubcats] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const toggleItem = (value, current, setter) => {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value));
    } else {
      setter([...current, value]);
    }
  };

  return (
    <div className="w-full max-w-xs h-[calc(100vh-100px)] sticky left-0 top-[93px] overflow-auto space-y-6 bg-white dark:bg-black shadow-md hidden lg:block ">
      <div className="mb-0 bg-[#DFF2EF] dark:bg-[#202020] p-5 flex justify-between items-center">
        <h2 className="text-2xl font-bold  font-asul">Filter</h2>
        <p className="text-sm hover:cursor-pointer">Clear Filter</p>
      </div>

      <div>
        {/* Categories */}
        <div className="p-5">
          <h3 className="text-lg font-semibold ">Categories</h3>
          <Accordion type="multiple" className="w-full">
            {categories.map((cat, index) => (
              <AccordionItem key={cat.title} value={`cat-${index}`}>
                <AccordionTrigger className="hover:cursor-pointer">
                  {cat.title}
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pl-2">
                  {cat.subcat.map((sub) => (
                    <div key={sub} className="flex items-center gap-2">
                      <Checkbox
                        id={sub}
                        checked={selectedSubcats.includes(sub)}
                        onCheckedChange={() =>
                          toggleItem(sub, selectedSubcats, setSelectedSubcats)
                        }
                      />
                      <label
                        htmlFor={sub}
                        className="text-sm text-muted-foreground"
                      >
                        {sub}
                      </label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <hr />
        {/* Price Range */}
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-2">Price Range</h3>
          <Slider
            defaultValue={[priceRange[0], priceRange[1]]}
            min={0}
            max={5000}
            step={100}
            onValueChange={(value) => setPriceRange(value)}
            className="w-full hover:cursor-pointer"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Tk {priceRange[0]}</span>
            <span>Tk {priceRange[1]}</span>
          </div>
        </div>
        <hr />
        {/* Colors */}
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-2">Color</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <label
                key={color}
                className="flex items-center gap-2 hover:cursor-pointer"
              >
                <Checkbox
                  className="hover:cursor-pointer"
                  id={color}
                  checked={selectedColors.includes(color)}
                  onCheckedChange={() =>
                    toggleItem(color, selectedColors, setSelectedColors)
                  }
                />
                <span className="text-sm">{color}</span>
              </label>
            ))}
          </div>
        </div>
        <hr />
        {/* Sizes */}
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-2">Size</h3>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => (
              <label
                key={size}
                className="flex items-center gap-2 hover:cursor-pointer"
              >
                <Checkbox
                  className="hover:cursor-pointer"
                  id={size}
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={() =>
                    toggleItem(size, selectedSizes, setSelectedSizes)
                  }
                />
                <span className="text-sm">{size}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsFilter;
