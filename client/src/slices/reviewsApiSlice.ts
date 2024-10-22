import { apiSlice } from "./apiSlice";
import { REVIEWS_URL } from "../constants";

export const reviewsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: ({ pageNumber }) => ({
        url: REVIEWS_URL,
        params: {
          pageNumber,
        },
      }),
      providesTags: ["Reviews"],
      keepUnusedDataFor: 5,
    }),
    getFeaturedReviews: builder.query({
      query: ({ pageNumber }) => ({
        url: `${REVIEWS_URL}/featured`,
        params: {
          pageNumber,
        },
      }),
      providesTags: ["FeaturedReviews"],
      keepUnusedDataFor: 5,
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: REVIEWS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `${REVIEWS_URL}/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
    acknowledgeReview: builder.mutation({
      query: ({ reviewId, acknowledge }) => ({
        url: `${REVIEWS_URL}/${reviewId}/acknowledge`,
        method: "PUT",
        body: { acknowledge },
      }),
    }),
    addReplyToReview: builder.mutation({
      query: ({ reviewId, reply }) => ({
        url: `${REVIEWS_URL}/${reviewId}/reply`,
        method: "POST",
        body: reply,
      }),
    }),
    likeReview: builder.mutation({
      query: ({ reviewId }) => ({
        url: `${REVIEWS_URL}/${reviewId}/like`,
        method: "PUT",
        params: { reviewId },
      }),
    }),
    dislikeReview: builder.mutation({
      query: ({ reviewId }) => ({
        url: `${REVIEWS_URL}/${reviewId}/unlike`,
        method: "PUT",
        params: { reviewId },
      }),
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetReviewsQuery,
  useDeleteReviewMutation,
  useAddReplyToReviewMutation,
  useLikeReviewMutation,
  useDislikeReviewMutation,
  useAcknowledgeReviewMutation,
  useGetFeaturedReviewsQuery,
} = reviewsApiSlice;
