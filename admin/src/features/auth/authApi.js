import { apiSlice } from "../api/apiSlice";
import { adminLogIn } from "../auth/authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/category/parent/all",
    }),
    signIn: builder.mutation({
      query: (data) => ({
        url: "/auth/signin",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          localStorage.setItem(
            "auth",
            JSON.stringify({
              accessToken: result.data.accessToken,
              admin: result.data.admin,
            })
          );

          dispatch(
            adminLogIn({
              accessToken: result.data.accessToken,
              admin: result.data.admin,
            })
          );
        } catch (error) {}
      },
    }),
  }),
});

// Export the hook to use in components
export const { useGetUserQuery, useSignInMutation } = authApi;
