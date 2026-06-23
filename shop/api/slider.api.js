import { apiFetch } from "@/api/api";

export async function fetchSliders() {
  const { data } = await apiFetch("/sliders", { next: { revalidate: 300 } });
    // const { data } = await apiFetch("/sliders", {cache: "no-store",});
  return data;
}
