// lib/products/getAllProducts.js
export default async function getAllProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/all`,
      {
        cache: "no-store", // use 'force-cache' if caching is okay
      }
    );

    if (!res.ok) {
      // throw new Error("Failed to fetch products");

      return [];
    }

    return res.json();
  } catch (err) {
    // Log error for debugging
    console.error("Failed to load slider:", err);
    return []; // <-- Return an empty array on error!
  }
}
