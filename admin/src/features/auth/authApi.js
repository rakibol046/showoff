import { apiSlice } from "../api/apiSlice";
import { adminLogIn } from "../auth/authSlice";
import { toast } from "sonner";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (data) => ({
        url: "/auth/signin",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          // data is { accessToken, admin, expiresIn } after envelope unwrap
          const payload = { accessToken: data.accessToken, admin: data.admin };
          localStorage.setItem("auth", JSON.stringify(payload));
          dispatch(adminLogIn(payload));
          toast.success("Logged in successfully");
        } catch {}
      },
    }),

    getProfile: builder.query({
      query: () => "/auth/profile",
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/auth/profile",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Profile updated");
        } catch {}
      },
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/password",
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Password changed successfully");
        } catch {}
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
