export async function fetchSlider() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/slider`, {
      cache: "force-cache",
    });
    return res.json();
  } catch (err) {
    console.error("Failed to load slider:", err);
    throw err;
  }
}
