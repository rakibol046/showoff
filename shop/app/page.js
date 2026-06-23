import Slider from "@/components/home/slider";
import NewArrival from "@/components/home/new-arrival";
import CategorySection from "@/components/home/home-category";
import { fetchSliders } from "@/api/slider.api";
import { fetchProducts } from "@/api/product.api";
import { fetchParentCategories } from "@/api/category.api";

export default async function Home() {
  const [sliders, { products }, parentCategories] = await Promise.all([
    fetchSliders().catch(() => []),
    fetchProducts({ limit: 12 }).catch(() => ({ products: [] })),
    fetchParentCategories().catch(() => []),
  ]);

  return (
    <div>
      <Slider sliders={sliders} />
      <NewArrival products={products} />
      <CategorySection categories={parentCategories} />
    </div>
  );
}
