export async function fetchCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`,
    );
    return await res.json();
  } catch (err) {
    console.error("Failed to load categories:", err);
    throw err;
  }
}

export async function fetchTopCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/top`,
    );
    return await res.json();
  } catch (err) {
    console.error("Failed to load top categories:", err);
    throw err;
  }
}

export async function fetchParentCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/parent`,
    );
    return await res.json();
  } catch (err) {
    console.error("Failed to load parent categories:", err);
    throw err;
  }
}
