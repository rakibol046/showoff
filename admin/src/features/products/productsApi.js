import { apiSlice } from "../api/apiSlice";

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/product/all", // Adjust the endpoint based on your API
    }),
  }),
});

// Export the hook to use in components
export const { useGetProductsQuery } = productsApi;
