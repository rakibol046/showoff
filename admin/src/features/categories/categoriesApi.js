import { apiSlice } from "../api/apiSlice";
import { toast } from "sonner";

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),
    getParentCategories: builder.query({
      query: () => "/categories/parents",
      providesTags: ["Categories"],
    }),
    getCategory: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),
    createCategory: builder.mutation({
      query: (formData) => ({
        url: "/categories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Category created"); } catch {}
      },
    }),
    updateCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => ["Categories", { type: "Category", id }],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Category updated"); } catch {}
      },
    }),
    toggleCategoryStatus: builder.mutation({
      query: ({ id, status }) => {
        const fd = new FormData();
        fd.append("status", String(!status));
        return { url: `/categories/${id}`, method: "PUT", body: fd };
      },
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["Categories"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Category deleted"); } catch {}
      },
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetParentCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useToggleCategoryStatusMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
