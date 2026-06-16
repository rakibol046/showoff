import { apiSlice } from "../api/apiSlice";
import { toast } from "sonner";

export const colorsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getColors: builder.query({
      query: (params = {}) => ({ url: "/colors", params }),
      providesTags: ["Colors"],
    }),
    getColor: builder.query({
      query: (id) => `/colors/${id}`,
    }),
    createColor: builder.mutation({
      query: (data) => ({ url: "/colors", method: "POST", body: data }),
      invalidatesTags: ["Colors"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Color created"); } catch {}
      },
    }),
    updateColor: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/colors/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Colors"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Color updated"); } catch {}
      },
    }),
    toggleColorStatus: builder.mutation({
      query: (id) => ({ url: `/colors/${id}/status`, method: "PATCH" }),
      invalidatesTags: ["Colors"],
    }),
    deleteColor: builder.mutation({
      query: (id) => ({ url: `/colors/${id}`, method: "DELETE" }),
      invalidatesTags: ["Colors"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Color deleted"); } catch {}
      },
    }),
    bulkDeleteColors: builder.mutation({
      query: (ids) => ({ url: "/colors/bulk", method: "DELETE", body: { ids } }),
      invalidatesTags: ["Colors"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Colors deleted"); } catch {}
      },
    }),
  }),
});

export const {
  useGetColorsQuery,
  useGetColorQuery,
  useCreateColorMutation,
  useUpdateColorMutation,
  useToggleColorStatusMutation,
  useDeleteColorMutation,
  useBulkDeleteColorsMutation,
} = colorsApi;
