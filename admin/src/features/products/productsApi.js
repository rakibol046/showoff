import { apiSlice } from "../api/apiSlice";
import { toast } from "sonner";

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params = {}) => ({ url: "/products", params }),
      providesTags: ["Products"],
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation({
      query: (formData) => ({
        url: "/products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Product created"); } catch {}
      },
    }),
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => ["Products", { type: "Product", id }],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Product updated"); } catch {}
      },
    }),
    toggleProductStatus: builder.mutation({
      query: (id) => ({ url: `/products/${id}/status`, method: "PATCH" }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Products"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Product deleted"); } catch {}
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useToggleProductStatusMutation,
  useDeleteProductMutation,
} = productsApi;
