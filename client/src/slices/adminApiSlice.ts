import { apiSlice } from "./apiSlice";
import { ADMIN_URL } from "../constants";

export const reviewsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/auth/login`,
        method: "POST",
        body: data,
      }),
    }),
    logoutAdmin: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/auth/logout`,
        method: "POST",
      }),
    }),
    verifyToken: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/auth/verify-token`,
        method: "GET",
      }),
    }),
    resetPin: builder.mutation({
      query: ({ newPin, oldPin }) => ({
        url: `${ADMIN_URL}/auth/reset-pin`,
        method: "PUT",
        body: { newPin, oldPin },
      }),
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useLogoutAdminMutation,
  useVerifyTokenQuery,
  useResetPinMutation,
} = reviewsApiSlice;
