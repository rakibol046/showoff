import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Unwrap the standardized { success, message, data } envelope automatically
const baseQueryWithUnwrap = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const message =
      result.error?.data?.message ||
      result.error?.error ||
      "Something went wrong";

    // Only show toast for mutations (non-GET requests)
    const method =
      typeof args === "string" ? "GET" : (args?.method || "GET").toUpperCase();
    if (method !== "GET") {
      toast.error(message);
    }
    return result;
  }

  // Unwrap envelope so hooks get .data directly
  if (result.data && result.data.success !== undefined) {
    const payload = result.data.data ?? result.data;
    // Preserve meta for paginated responses
    if (result.data.meta) {
      return { data: { data: payload, meta: result.data.meta } };
    }
    return { data: payload };
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithUnwrap,
  tagTypes: [
    "Products",
    "Product",
    "Categories",
    "Category",
    "Colors",
    "Sizes",
    "Sliders",
    "Orders",
    "Order",
    "Customers",
    "Customer",
    "Dashboard",
    "Profile",
  ],
  endpoints: () => ({}),
});
