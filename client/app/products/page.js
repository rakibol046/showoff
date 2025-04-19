import Image from "next/image";
import getAllProducts from "@/lib/products/getAllProducts";
export const metadata = {
  title: "Products | ShowOff",
  description: "A e-commerce platform",
};

export default async function Products() {
  const products = await getAllProducts();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">All Products</h1>
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h2>{product.name}</h2>
            <p>৳{product.sell_price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
