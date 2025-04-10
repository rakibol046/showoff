// lib/products/getAllProducts.js
export default async function getAllProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/all`,
    {
      cache: "no-store", // use 'force-cache' if caching is okay
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}
