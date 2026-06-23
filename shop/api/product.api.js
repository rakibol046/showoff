import { apiFetch } from "@/api/api";

export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams();
  const singleKeys = ["name", "parentcat", "childcat", "color", "size", "min_price", "max_price", "super_offer", "page", "limit"];
  singleKeys.forEach((k) => { if (filters[k] !== undefined && filters[k] !== "") params.append(k, filters[k]); });
  if (filters.subcat) {
    const subcats = Array.isArray(filters.subcat) ? filters.subcat : [filters.subcat];
    subcats.forEach((s) => params.append("subcat", s));
  }

  const qs = params.toString();
  const { data, meta } = await apiFetch(`/products${qs ? `?${qs}` : ""}`, {
    next: { revalidate: 60 },
  });
  return { products: data, meta };
}

export async function fetchProductBySlug(slug) {
  const { data } = await apiFetch(`/products/${slug}`, {
    next: { revalidate: 120 },
  });
  return data;
}
