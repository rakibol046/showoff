import Image from "next/image";
import getAllProducts from "@/lib/products/getAllProducts";
import ProductCard from "@/components/product/product-card";
import ProductsFilter from "@/components/product/products-filter";
export const metadata = {
  title: "Products | ShowOff",
  description: "A e-commerce platform",
};

export default async function Products() {
  const products = await getAllProducts();

  return (
    <div className="flex mt-2">
      <ProductsFilter />
      <div class="px-2 flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            image="/images/img4.webp"
            name={product.name}
            price={product.sell_price}
          />
        ))}
      </div>
    </div>
  );
}
