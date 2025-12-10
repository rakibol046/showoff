// lib/products/getAllProducts.js

export async function getSlider() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/slider`, {
      cache: "no-store", // or 'force-cache' if data rarely changes
    });

    // Check for HTTP error status:
    if (!res.ok) {
      console.error("Failed to fetch sliders. Status:", res.status);
      return []; // <-- Always return an array, even on error
    }

    const data = await res.json();
    return data;
  } catch (err) {
    // Log error for debugging
    console.error("Failed to load slider:", err);
    return []; // <-- Return an empty array on error!
  }
}
