import { apiSlice } from "../api/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
    getSalesReport: builder.query({
      query: () => "/dashboard/sales-report",
      providesTags: ["SalesReport"],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetSalesReportQuery } = dashboardApi;
