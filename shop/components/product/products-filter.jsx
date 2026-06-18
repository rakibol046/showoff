"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { SlidersHorizontal, Zap, ChevronDown } from "lucide-react";
import { symbol } from "@/lib/currency";

const PRICE_MAX = 200000;

function ThreeLayerCategories({ categories, searchParams, onSelectParent, onSelectChild, onToggleSubcat }) {
  const selectedParent = searchParams.get("parentcat");
  const selectedChild = searchParams.get("childcat");
  const selectedSubcats = searchParams.getAll("subcat");

  const getInitialExpanded = () => {
    const open = new Set();
    categories.forEach((parent, i) => {
      if (
        parent.name === selectedParent ||
        parent.children?.some(
          (c) => c.name === selectedChild || c.children?.some((s) => selectedSubcats.includes(s.name))
        )
      ) {
        open.add(i);
      }
    });
    return open;
  };

  const [expanded, setExpanded] = useState(getInitialExpanded);

  const toggleExpand = (i) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <div className="space-y-1">
      {categories.map((parent, pIndex) => {
        const isOpen = expanded.has(pIndex);
        const isParentActive = selectedParent === parent.name;
        const hasChildren = (parent.children || []).length > 0;

        return (
          <div key={parent._id}>
            {/* ── Layer 1: Parent ── */}
            <div
              className={`flex items-center rounded-xl transition-colors ${
                isParentActive ? "bg-primary/10" : "hover:bg-muted/50"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectParent(parent.name)}
                className="flex flex-1 items-center gap-3 px-3 py-2.5 text-left"
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 border-2 transition-all ${
                    isParentActive
                      ? "bg-primary border-primary scale-110"
                      : "border-muted-foreground/40"
                  }`}
                />
                <span
                  className={`text-sm transition-colors ${
                    isParentActive ? "font-bold text-primary" : "font-medium text-foreground"
                  }`}
                >
                  {parent.name}
                </span>
              </button>
              {hasChildren && (
                <button
                  type="button"
                  onClick={() => toggleExpand(pIndex)}
                  className="px-3 py-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={isOpen ? "Collapse" : "Expand"}
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
              )}
            </div>

            {/* ── Expanded children panel ── */}
            {isOpen && hasChildren && (
              <div className="ml-3 mt-1 mb-2 pl-3 border-l-2 border-primary/20 space-y-0.5">
                {parent.children.map((child) => {
                  const isChildActive = selectedChild === child.name;
                  const hasSubs = (child.children || []).length > 0;

                  return (
                    <div key={child._id}>
                      {/* ── Layer 2: Child ── */}
                      <button
                        type="button"
                        onClick={() => onSelectChild(child.name)}
                        className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                          isChildActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 border transition-all ${
                            isChildActive ? "bg-primary border-primary" : "border-muted-foreground/40"
                          }`}
                        />
                        {child.name}
                      </button>

                      {/* ── Layer 3: Sub-child chips ── */}
                      {hasSubs && (
                        <div className="ml-6 mt-1.5 mb-2 flex flex-wrap gap-1.5">
                          {child.children.map((sub) => {
                            const isSubActive = selectedSubcats.includes(sub.name);
                            return (
                              <button
                                key={sub._id}
                                type="button"
                                onClick={() => onToggleSubcat(sub.name)}
                                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                                  isSubActive
                                    ? "bg-primary text-primary-foreground border-primary font-medium shadow-sm"
                                    : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                                }`}
                              >
                                {sub.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FilterContent({ categories, searchParams, onSelectParent, onSelectChild, onToggleSubcat, onPriceChange, onToggleSuperOffer }) {
  const minPrice = Number(searchParams.get("min_price") || 0);
  const maxPrice = Number(searchParams.get("max_price") || PRICE_MAX);
  const superOffer = searchParams.get("super_offer") === "true";

  return (
    <div className="divide-y divide-border/60">
      {/* Super Offer */}
      <div className="p-4">
        <button
          type="button"
          onClick={onToggleSuperOffer}
          className={`w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all cursor-pointer ${
            superOffer
              ? "border-amber-400 bg-amber-50 dark:bg-amber-950/40 shadow-sm"
              : "border-border hover:border-amber-300 hover:bg-amber-50/40 dark:hover:bg-amber-950/20"
          }`}
        >
          <Zap
            className={`w-4 h-4 shrink-0 transition-colors ${
              superOffer ? "text-amber-500 fill-amber-400" : "text-muted-foreground"
            }`}
          />
          <span
            className={`text-sm font-semibold flex-1 text-left ${
              superOffer ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
            }`}
          >
            Super Offer
          </span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full transition-all ${
              superOffer
                ? "bg-amber-400 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {superOffer ? "ON" : "OFF"}
          </span>
        </button>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">
            Categories
          </p>
          <ThreeLayerCategories
            categories={categories}
            searchParams={searchParams}
            onSelectParent={onSelectParent}
            onSelectChild={onSelectChild}
            onToggleSubcat={onToggleSubcat}
          />
        </div>
      )}

      {/* Price Range */}
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 px-1">
          Price Range
        </p>
        <Slider
          value={[minPrice, maxPrice]}
          min={0}
          max={PRICE_MAX}
          step={100}
          onValueChange={onPriceChange}
          className="w-full hover:cursor-pointer"
        />
        <div className="flex justify-between mt-3">
          <span className="text-xs font-medium bg-muted px-2.5 py-1 rounded-lg">{symbol}{minPrice}</span>
          <span className="text-xs font-medium bg-muted px-2.5 py-1 rounded-lg">{symbol}{maxPrice}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProductsFilter({ categories = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = useCallback(
    (params) => {
      const qs = params.toString();
      router.push(`/products${qs ? `?${qs}` : ""}`);
    },
    [router]
  );

  const selectParent = useCallback(
    (name) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get("parentcat");
      params.delete("parentcat");
      params.delete("childcat");
      params.delete("subcat");
      if (current !== name) params.set("parentcat", name);
      navigate(params);
    },
    [searchParams, navigate]
  );

  const selectChild = useCallback(
    (name) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get("childcat");
      params.delete("parentcat");
      params.delete("childcat");
      params.delete("subcat");
      if (current !== name) params.set("childcat", name);
      navigate(params);
    },
    [searchParams, navigate]
  );

  const toggleSubcat = useCallback(
    (name) => {
      const current = searchParams.getAll("subcat");
      const params = new URLSearchParams(searchParams.toString());
      params.delete("parentcat");
      params.delete("childcat");
      params.delete("subcat");
      const next = current.includes(name) ? current.filter((v) => v !== name) : [...current, name];
      next.forEach((v) => params.append("subcat", v));
      navigate(params);
    },
    [searchParams, navigate]
  );

  const handlePriceChange = useCallback(
    (range) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("min_price", range[0]);
      params.set("max_price", range[1]);
      navigate(params);
    },
    [searchParams, navigate]
  );

  const toggleSuperOffer = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("super_offer") === "true") {
      params.delete("super_offer");
    } else {
      params.set("super_offer", "true");
    }
    navigate(params);
  }, [searchParams, navigate]);

  const clearFilters = useCallback(() => router.push("/products"), [router]);

  const filterProps = {
    categories,
    searchParams,
    onSelectParent: selectParent,
    onSelectChild: selectChild,
    onToggleSubcat: toggleSubcat,
    onPriceChange: handlePriceChange,
    onToggleSuperOffer: toggleSuperOffer,
  };

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
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Clear
                  </button>
                </DrawerClose>
              </div>
            </DrawerHeader>
            <div className="overflow-y-auto flex-1">
              <FilterContent {...filterProps} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop sidebar */}
      <div className="w-full max-w-xs h-[calc(100vh-100px)] sticky left-0 top-[93px] overflow-auto bg-white dark:bg-black shadow-md hidden lg:block">
        <div className="bg-[#DFF2EF] dark:bg-[#202020] px-5 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold font-asul">Filter</h2>
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors hover:cursor-pointer"
          >
            Clear all
          </button>
        </div>
        <FilterContent {...filterProps} />
      </div>
    </>
  );
}
