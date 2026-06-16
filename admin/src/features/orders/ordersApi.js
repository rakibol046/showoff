import { apiSlice } from "../api/apiSlice";
import { toast } from "sonner";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params = {}) => ({ url: "/orders", params }),
      providesTags: ["Orders"],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, order_status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: { order_status },
      }),
      invalidatesTags: (result, error, { id }) => ["Orders", { type: "Order", id }],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Order status updated"); } catch {}
      },
    }),
    updatePaymentStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/orders/${id}/payment`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Orders", { type: "Order", id }],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Payment status updated"); } catch {}
      },
    }),
    createOrder: builder.mutation({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      invalidatesTags: ["Orders"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Order created"); } catch {}
      },
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useCreateOrderMutation,
} = ordersApi;
