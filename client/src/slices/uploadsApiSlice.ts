import { UPLOADS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const uploadsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadSingleImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOADS_URL}/image`,
        method: "POST",
        body: data,
      }),
    }),
    // uploadMultipleImages: builder.mutation({
    //   query: (data) => ({
    //     url: `${UPLOADS_URL}/images`,
    //     method: "POST",
    //     body: data,
    //   }),
    // }),
  }),
});

export const { useUploadSingleImageMutation } = uploadsApiSlice;
