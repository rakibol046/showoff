
export async function fetchProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/all`,
      {
        cache: "no-store", // use 'force-cache' if caching is okay
      }
    );
    return await res.json();
  } catch (err) {
    console.error("Failed to load slider:", err);
    throw err;
  }
}

export async function fetchProductBySlug(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/${slug}`);
    return res.json();
  } catch (error) {
    console.error("Failed to fetch product by slug:", error);
    throw error;
  }
}
