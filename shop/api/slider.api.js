import { apiFetch } from "@/lib/api";

export async function fetchSliders() {
  const { data } = await apiFetch("/sliders", { next: { revalidate: 300 } });
  return data;
}
