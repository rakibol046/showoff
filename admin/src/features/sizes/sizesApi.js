import { apiSlice } from "../api/apiSlice";
import { toast } from "sonner";

export const sizesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSizes: builder.query({
      query: (params = {}) => ({ url: "/sizes", params }),
      providesTags: ["Sizes"],
    }),
    getSize: builder.query({
      query: (id) => `/sizes/${id}`,
    }),
    createSize: builder.mutation({
      query: (data) => ({ url: "/sizes", method: "POST", body: data }),
      invalidatesTags: ["Sizes"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Size created"); } catch {}
      },
    }),
    updateSize: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/sizes/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Sizes"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Size updated"); } catch {}
      },
    }),
    toggleSizeStatus: builder.mutation({
      query: (id) => ({ url: `/sizes/${id}/status`, method: "PATCH" }),
      invalidatesTags: ["Sizes"],
    }),
    deleteSize: builder.mutation({
      query: (id) => ({ url: `/sizes/${id}`, method: "DELETE" }),
      invalidatesTags: ["Sizes"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Size deleted"); } catch {}
      },
    }),
    bulkDeleteSizes: builder.mutation({
      query: (ids) => ({ url: "/sizes/bulk", method: "DELETE", body: { ids } }),
      invalidatesTags: ["Sizes"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Sizes deleted"); } catch {}
      },
    }),
  }),
});

export const {
  useGetSizesQuery,
  useGetSizeQuery,
  useCreateSizeMutation,
  useUpdateSizeMutation,
  useToggleSizeStatusMutation,
  useDeleteSizeMutation,
  useBulkDeleteSizesMutation,
} = sizesApi;
