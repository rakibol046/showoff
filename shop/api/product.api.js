import { apiFetch } from "@/lib/api";

export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams();
  const allowed = ["name", "parentcat", "childcat", "color", "size", "min_price", "max_price", "super_offer", "page", "limit"];
  allowed.forEach((k) => { if (filters[k] !== undefined && filters[k] !== "") params.append(k, filters[k]); });

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
