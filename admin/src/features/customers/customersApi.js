import { apiSlice } from "../api/apiSlice";
import { toast } from "sonner";

export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: (params = {}) => ({ url: "/customers", params }),
      providesTags: ["Customers"],
    }),
    getCustomer: builder.query({
      query: (id) => `/customers/${id}`,
      providesTags: (result, error, id) => [{ type: "Customer", id }],
    }),
    toggleCustomerStatus: builder.mutation({
      query: (id) => ({ url: `/customers/${id}/status`, method: "PATCH" }),
      invalidatesTags: ["Customers"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Customer status updated"); } catch {}
      },
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useToggleCustomerStatusMutation,
} = customersApi;
