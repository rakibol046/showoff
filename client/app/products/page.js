import Image from "next/image";
import { fetchProducts } from "@/api/product.api";
import ProductCard from "@/components/product/product-card";
import ProductsFilter from "@/components/product/products-filter";

export const metadata = {
  title: "Products | ShowOff",
  description: "A e-commerce platform",
};

export default async function Products({ searchParams }) {
  const params = await searchParams;
  console.log("Filters:", params);
  const products = await fetchProducts(params);

  return (
    <div className="flex mt-2">
      <ProductsFilter />
      <div className="px-2 flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
        {products.map((prod) => (
          <ProductCard key={prod._id} product={prod} />
        ))}
      </div>
    </div>
  );
}
