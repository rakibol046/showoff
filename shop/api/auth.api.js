import { apiFetch } from "@/lib/api";

export async function registerCustomer(body) {
  const { data } = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data;
}

export async function loginCustomer(body) {
  const { data } = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data;
}

export async function getCustomerProfile(token) {
  const { data } = await apiFetch("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
