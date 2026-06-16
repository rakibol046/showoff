import { apiSlice } from "../api/apiSlice";
import { toast } from "sonner";

export const slidersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSliders: builder.query({
      query: () => "/sliders",
      providesTags: ["Sliders"],
    }),
    getSlider: builder.query({
      query: (id) => `/sliders/${id}`,
    }),
    createSlider: builder.mutation({
      query: (formData) => ({ url: "/sliders", method: "POST", body: formData }),
      invalidatesTags: ["Sliders"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Slider created"); } catch {}
      },
    }),
    updateSlider: builder.mutation({
      query: ({ id, formData }) => ({ url: `/sliders/${id}`, method: "PUT", body: formData }),
      invalidatesTags: ["Sliders"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Slider updated"); } catch {}
      },
    }),
    toggleSliderStatus: builder.mutation({
      query: (id) => ({ url: `/sliders/${id}/status`, method: "PATCH" }),
      invalidatesTags: ["Sliders"],
    }),
    deleteSlider: builder.mutation({
      query: (id) => ({ url: `/sliders/${id}`, method: "DELETE" }),
      invalidatesTags: ["Sliders"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try { await queryFulfilled; toast.success("Slider deleted"); } catch {}
      },
    }),
  }),
});

export const {
  useGetSlidersQuery,
  useGetSliderQuery,
  useCreateSliderMutation,
  useUpdateSliderMutation,
  useToggleSliderStatusMutation,
  useDeleteSliderMutation,
} = slidersApi;
