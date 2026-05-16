export async function fetchProducts(filters = {}) {
  try {
    // Build query string from filters object
    const queryParams = new URLSearchParams();

    // Add each filter if it exists
    if (filters.name) queryParams.append("name", filters.name);
    if (filters.parentcat) queryParams.append("parentcat", filters.parentcat); //parent category; type 1
    if (filters.childcat) queryParams.append("childcat", filters.childcat); //child category; type 2
    if (filters.color) queryParams.append("color", filters.color);
    if (filters.size) queryParams.append("size", filters.size);
    if (filters.limit) queryParams.append("limit", filters.limit);
    if (filters.price) queryParams.append("price", filters.price);

    const queryString = queryParams.toString();
    console.log("Query String:", queryString);
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      next: { revalidate: 60 }, // Optional: ISR cache
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Failed to load products:", err);
    throw err;
  }
}

export async function fetchProductBySlug(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${slug}`,
    );
    return res.json();
  } catch (error) {
    console.error("Failed to fetch product by slug:", error);
    throw error;
  }
}
