const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiFetch(path, { next, cache, headers, ...opts } = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: { "Content-Type": "application/json", ...headers },
    ...(next ? { next } : {}),
    ...(cache ? { cache } : {}),
  });

  if (res.status === 401 && typeof window !== "undefined") {
    const { AUTH_TOKEN_KEY } = await import("@/lib/constants");
    localStorage.removeItem(AUTH_TOKEN_KEY);
    window.location.href = "/auth/login";
    return;
  }

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`API error ${res.status}: invalid response`);
  }

  if (!res.ok || json.success === false) {
    throw new Error(json.message || `API error ${res.status}`);
  }

  return { data: json.data ?? json, meta: json.meta ?? null };
}
