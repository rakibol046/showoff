import Image from "next/image";

import Slider from "@/components/home/slider";
import NewArrival from "@/components/home/new-arrival";
import { fetchSlider } from "@/api/slider.api";
import { fetchProducts } from "@/api/product.api";

export default async function Home() {
  const sliders = await fetchSlider();
  // console.log("Slider : ", sliders);
  const products = await fetchProducts("limit=8");
  // console.log("Products : ", products);
  return (
    <div>
      <Slider sliders={sliders} />

      <NewArrival products={products} />
    </div>
  );
}
