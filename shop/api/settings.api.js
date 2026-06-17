import { apiFetch } from "@/lib/api";

export async function fetchSettings() {
  const { data } = await apiFetch("/settings", { next: { revalidate: 3600 } });
  return data;
}
