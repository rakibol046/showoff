"use client";

import { Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductTabs({ product }) {
  return (
    <div className="mt-16">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent
          value="description"
          className="mt-6 bg-white rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold mb-4">Product Description</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <h3 className="font-semibold mb-3">Key Features:</h3>
          <ul className="space-y-2">
            {/* {product?.features?.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span className="text-gray-600">{feature}</span>
              </li>
            ))} */}
          </ul>
        </TabsContent>

        <TabsContent
          value="specifications"
          className="mt-6 bg-white rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold mb-4">Technical Specifications</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4"></dl>
        </TabsContent>

        <TabsContent
          value="reviews"
          className="mt-6 bg-white rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
          <div className="flex items-center gap-4 mb-6">
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          </div>
          <p className="text-gray-500">
            Reviews section would display customer feedback here.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
