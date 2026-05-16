import { apiSlice } from "../api/apiSlice";

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/category",
    }),
    getParentCategories: builder.query({
      query: () => "/category/parent",
    }),
    addCategory: builder.mutation({
      query: (data) => ({
        url: "/category/add",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export the hook to use in components
export const {
  useGetCategoriesQuery,
  useGetParentCategoriesQuery,
  useAddCategoryMutation,
} = categoriesApi;
