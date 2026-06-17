"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { symbol } from "@/lib/currency";

const COLORS = ["Red", "Blue", "Black", "White", "Green", "Yellow", "Pink"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PRICE_MAX = 5000;

function FilterContent({ categories, searchParams, onToggleMulti, onPriceChange }) {
  const selectedColors = searchParams.getAll("color");
  const selectedSizes = searchParams.getAll("size");
  const selectedChildcats = searchParams.getAll("childcat");
  const minPrice = Number(searchParams.get("min_price") || 0);
  const maxPrice = Number(searchParams.get("max_price") || PRICE_MAX);

  return (
    <div>
      {categories.length > 0 && (
        <>
          <div className="p-5">
            <h3 className="text-lg font-semibold">Categories</h3>
            <Accordion type="multiple" className="w-full">
              {categories.map((cat, index) => (
                <AccordionItem key={cat._id || cat.name} value={`cat-${index}`}>
                  <AccordionTrigger className="hover:cursor-pointer">{cat.name}</AccordionTrigger>
                  <AccordionContent className="space-y-2 pl-2">
                    {(cat.children || cat.subcat || []).map((sub) => {
                      const name = sub.name || sub;
                      return (
                        <div key={name} className="flex items-center gap-2">
                          <Checkbox
                            id={`sub-${name}`}
                            checked={selectedChildcats.includes(name)}
                            onCheckedChange={() => onToggleMulti("childcat", name)}
                          />
                          <label htmlFor={`sub-${name}`} className="text-sm text-muted-foreground cursor-pointer">
                            {name}
                          </label>
                        </div>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <hr />
        </>
      )}

      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2">Price Range</h3>
        <Slider
          value={[minPrice, maxPrice]}
          min={0}
          max={PRICE_MAX}
          step={100}
          onValueChange={onPriceChange}
          className="w-full hover:cursor-pointer"
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>{symbol}{minPrice}</span>
          <span>{symbol}{maxPrice}</span>
        </div>
      </div>
      <hr />

      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2">Color</h3>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((color) => (
            <label key={color} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() => onToggleMulti("color", color)}
              />
              <span className="text-sm">{color}</span>
            </label>
          ))}
        </div>
      </div>
      <hr />

      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2">Size</h3>
        <div className="flex flex-wrap gap-3">
          {SIZES.map((size) => (
            <label key={size} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={() => onToggleMulti("size", size)}
              />
              <span className="text-sm">{size}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsFilter({ categories = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const buildUrl = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, values]) => {
      params.delete(key);
      values.forEach((v) => params.append(key, v));
    });
    return `/products${params.toString() ? `?${params.toString()}` : ""}`;
  }, [searchParams]);

  const toggleMulti = useCallback((key, value) => {
    const current = searchParams.getAll(key);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    router.push(buildUrl({ [key]: next }));
  }, [searchParams, router, buildUrl]);

  const handlePriceChange = useCallback((range) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("min_price", range[0]);
    params.set("max_price", range[1]);
    router.push(`/products?${params.toString()}`);
  }, [searchParams, router]);

  const clearFilters = useCallback(() => router.push("/products"), [router]);

  return (
    <>
      {/* Mobile filter trigger */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <Drawer direction="left">
          <DrawerTrigger asChild>
            <Button size="sm" className="shadow-lg gap-2 rounded-full px-5">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-full max-w-xs">
            <DrawerHeader className="border-b">
              <div className="flex justify-between items-center">
                <DrawerTitle className="font-asul text-2xl">Filter</DrawerTitle>
                <DrawerClose asChild>
                  <button type="button" onClick={clearFilters} className="text-sm text-muted-foreground hover:underline">
                    Clear
                  </button>
                </DrawerClose>
              </div>
            </DrawerHeader>
            <div className="overflow-y-auto flex-1">
              <FilterContent
                categories={categories}
                searchParams={searchParams}
                onToggleMulti={toggleMulti}
                onPriceChange={handlePriceChange}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop sidebar */}
      <div className="w-full max-w-xs h-[calc(100vh-100px)] sticky left-0 top-[93px] overflow-auto space-y-6 bg-white dark:bg-black shadow-md hidden lg:block">
        <div className="mb-0 bg-[#DFF2EF] dark:bg-[#202020] p-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold font-asul">Filter</h2>
          <button type="button" onClick={clearFilters} className="text-sm hover:cursor-pointer">
            Clear Filter
          </button>
        </div>
        <FilterContent
          categories={categories}
          searchParams={searchParams}
          onToggleMulti={toggleMulti}
          onPriceChange={handlePriceChange}
        />
      </div>
    </>
  );
}
