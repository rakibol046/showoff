import { apiFetch } from "@/api/api";

export async function placeOrder(body, token = null) {
  const { data } = await apiFetch("/orders", {
    method: "POST",
    body: JSON.stringify(body),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
}

export async function getMyOrders(token, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const { data, meta } = await apiFetch(`/orders/my${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { orders: data, meta };
}

export async function getMyOrder(id, token) {
  const { data } = await apiFetch(`/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
