import { apiFetch } from "@/api/api";

export async function fetchCategories() {
  // const { data } = await apiFetch("/categories", { next: { revalidate: 300 } });
  const { data } = await apiFetch("/categories", {cache: "no-store",});
  return data;
}

export async function fetchTopCategories() {
  // const { data } = await apiFetch("/categories/top", { next: { revalidate: 300 } });
  const { data } = await apiFetch("/categories/top", {cache: "no-store",});
  return data;
}

export async function fetchParentCategories() {
  // const { data } = await apiFetch("/categories/parents", { next: { revalidate: 300 } });
    const { data } = await apiFetch("/categories/parents", {cache: "no-store",});
  return data;
}
