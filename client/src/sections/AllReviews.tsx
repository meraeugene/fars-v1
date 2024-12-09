import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import LoadMore from "../components/LoadMore";
import Loader from "@/components/Loader";
import { PiHeart, PiHeartFill } from "react-icons/pi";
import { formatNumber } from "@/utils/formatNumber";
import DeleteReviewModal from "@/components/DeleteReviewModal";
import ReplyReviewModal from "@/components/ReplyReviewModal";
import { useEffect, useState } from "react";
import { ErrorResponse, Review } from "@/types";
import { toast } from "react-toastify";
import {
  useAcknowledgeReviewMutation,
  useDeleteReviewMutation,
  useDislikeReviewMutation,
  useLikeReviewMutation,
} from "@/slices/reviewsApiSlice";
import { Dispatch, SetStateAction } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

type AllReviewsProps = {
  data?: {
    reviews: Review[];
    totalPages: number;
    pageCount: number;
  }; // `data` can be undefined if `useGetReviewsQuery` hasn't fetched data yet
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  reviewsError:
    | FetchBaseQueryError
    | SerializedError
    | ErrorResponse
    | undefined;
  isLoggedIn: string;
  setPageNumber: Dispatch<SetStateAction<number>>;
  pageNumber: number;
};

const AllReviews = ({
  data,
  isLoading,
  isError,
  isFetching,
  reviewsError,
  isLoggedIn,
  setPageNumber,
  pageNumber,
}: AllReviewsProps) => {
  const [allReviews, setAllReviews] = useState<Review[]>([]); // State to store all reviews

  const [likeReview] = useLikeReviewMutation(); // Mutation hook for liking a review
  const [dislikeReview] = useDislikeReviewMutation(); // Mutation hook for disliking a review

  const error = reviewsError as ErrorResponse;

  // Destructure the reviews and pagination data from API response
  const { reviews = [], totalPages } = data || { reviews: [], totalPages: 1 };

  // Append fetched reviews to existing reviews while filtering out duplicates
  useEffect(() => {
    if (reviews.length > 0) {
      const likedReviews = JSON.parse(
        localStorage.getItem("likedReviews") || "[]",
      );

      setAllReviews((prevReviews) => {
        const existingIds = new Set(prevReviews.map((review) => review._id));

        return [
          ...prevReviews,
          ...reviews.filter((review: Review) => !existingIds.has(review._id)),
        ].map((review) => ({
          ...review,
          liked: likedReviews.includes(review._id), // Set liked based on localStorage
        }));
      });
    }
  }, [reviews]);

  // Function to load more reviews (increment page number)
  const loadMoreReviews = () => {
    if (pageNumber < totalPages) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  // Function to handle like action
  const handleLike = async (reviewId: string) => {
    const likedReviews = JSON.parse(
      localStorage.getItem("likedReviews") || "[]",
    );

    // Check if the review has already been liked
    if (likedReviews.includes(reviewId)) {
      toast.info("You have already liked this review.");
      return;
    }

    try {
      await likeReview({ reviewId }).unwrap();

      // Add the review to local storage after a successful like
      localStorage.setItem(
        "likedReviews",
        JSON.stringify([...likedReviews, reviewId]),
      );

      // Update the local state to reflect the like
      setAllReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? { ...review, likes: review.likes + 1, liked: true }
            : review,
        ),
      );
    } catch (error) {
      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  // Function to handle dislike action
  const handleDislike = async (reviewId: string) => {
    const likedReviews = JSON.parse(
      localStorage.getItem("likedReviews") || "[]",
    );

    // Remove the review ID from local storage if it was disliked
    const updatedLikedReviews = likedReviews.filter(
      (id: string) => id !== reviewId,
    );
    localStorage.setItem("likedReviews", JSON.stringify(updatedLikedReviews));

    try {
      await dislikeReview({ reviewId }).unwrap();

      // Update the local state to reflect the dislike
      setAllReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? { ...review, likes: Math.max(0, review.likes - 1), liked: false }
            : review,
        ),
      );
    } catch (error) {
      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  // DELETE REVIEWS

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string>("");

  const toggleDeleteReviewModal = () => {
    setDeleteModal((prev) => !prev);
  };

  const [deleteReview] = useDeleteReviewMutation(); // Mutation hook for deleting a review

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await deleteReview(reviewId).unwrap(); // Perform the delete operation
      setAllReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewId),
      ); // Update local state
      toast.success(response.message);
    } catch (error) {
      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  // ACKNOWLEDEGE FEATURE
  const [acknowledgeReview] = useAcknowledgeReviewMutation();

  const handleAcknowledgeReview = async (
    reviewId: string,
    acknowledge: boolean,
  ) => {
    try {
      await acknowledgeReview({
        reviewId,
        acknowledge,
      }).unwrap();

      // Update the local state to reflect the acknowledgment status
      setAllReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? { ...review, acknowledged: acknowledge }
            : review,
        ),
      );
    } catch (error) {
      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  // REPLY TO REVIEW FEATURE
  const [replyModal, setReplyModal] = useState<boolean>(false);

  const toggleReplyReviewModal = () => {
    setReplyModal((prev) => !prev);
    document.body.classList.remove("menu-open");
  };

  const handleReplySubmit = (newReply: string) => {
    const userName = "Owner"; // Replace with the actual user's name from state or context

    // Find the review to update
    setAllReviews((prevReviews) =>
      prevReviews.map((review) =>
        review._id === selectedReviewId
          ? {
              ...review,
              replies: [
                ...review.replies,
                {
                  reply: newReply,
                  name: userName, // Add the user's name
                  createdAt: new Date(), // Set createdAt to the current date
                },
              ],
            }
          : review,
      ),
    );
  };

  return (
    <div className="reviews__container bg-[#f0f4ff] px-5 py-20 pb-0 md:px-10 lg:px-16 lg:pt-24 xl:px-40">
      <h1 className="h3-bold text-center text-[#0c1b4d]">All Reviews</h1>
      <p className="mx-auto mb-4 mt-2 max-w-sm px-10 text-center text-sm text-[#333f61] dark:text-neutral-300 lg:text-base">
        See what all our customers have to say about their experience!
      </p>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <div className="mt-8 rounded-lg border border-red-500 p-2 text-center">
          {error?.data?.message || error.error}
        </div>
      ) : allReviews.length > 0 ? (
        <div className="mt-12 columns-1 gap-x-8 gap-y-4 md:columns-2 lg:columns-3 xl:columns-4">
          {allReviews.map((review) => (
            <section
              className="white review-text mb-8 flex max-w-[100%] break-inside-avoid flex-col rounded-xl bg-[#fff] shadow-xl shadow-blue-200"
              key={review._id}
              data-aos="fade-right"
            >
              {review.image && (
                <div className="review-card-image__container">
                  <img
                    src={review.image}
                    alt="image"
                    className="rounded-tl-xl rounded-tr-xl object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div
                className={`review-card-info__container relative p-4 ${
                  review.image ? "rounded-tl-none rounded-tr-none" : ""
                }`}
              >
                <div className="rating__container mb-2 flex">
                  {Array.from({ length: 5 }, (_, index) => {
                    const starValue = index + 1;
                    return (
                      <span key={index}>
                        {review.rating >= starValue ? (
                          <FaStar size={16} color="#ff8873" />
                        ) : review.rating >= starValue - 0.5 ? (
                          <FaStarHalfAlt size={16} color="#ff8873" />
                        ) : (
                          <FaRegStar size={16} color="#ff8873" />
                        )}
                      </span>
                    );
                  })}
                </div>
                <div className="mt-5 flex flex-col gap-3">
                  <p className="break-words text-sm font-normal leading-[1.6] text-[#333f61]">
                    {review.feedback}
                  </p>

                  <p className="text-sm font-semibold leading-[1.6] text-[#0c1b4d]">
                    - {review.name}
                  </p>

                  <div className="flex items-center gap-2">
                    {review.liked ? (
                      <PiHeartFill
                        fontSize={18}
                        color="#3b82f6"
                        onClick={() => handleDislike(review._id)}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <PiHeart
                        fontSize={18}
                        onClick={() => handleLike(review._id)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    <h2 className="text-sm text-slate-600">LIKE?</h2>

                    <span className="text-sm font-medium text-blue-600">
                      {formatNumber(review.likes)}
                    </span>
                  </div>

                  {isLoggedIn && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {/* Reply Button */}
                      <button
                        onClick={() => {
                          setReplyModal(true);
                          setSelectedReviewId(review._id);
                          document.body.classList.add("menu-open");
                        }}
                        className="rounded-sm border border-green-700 px-2 py-1 text-xs font-medium tracking-wider text-green-700 transition-all duration-300 hover:bg-green-100"
                      >
                        REPLY
                      </button>

                      {/* Acknowledge Button */}
                      <button
                        onClick={() =>
                          handleAcknowledgeReview(
                            review._id,
                            !review.acknowledged,
                          )
                        }
                        className={`rounded-sm border border-blue-500 px-2 py-1 text-xs font-medium tracking-wider text-blue-600 transition-all duration-300 hover:bg-blue-100 ${
                          review.acknowledged ? "bg-blue-100" : ""
                        }`}
                      >
                        {review.acknowledged ? "UNACKNOWLEDGE" : "ACKNOWLEDGE"}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          setDeleteModal(true);
                          setSelectedReviewId(review._id);
                          document.body.classList.add("menu-open");
                        }}
                        className="rounded-sm border border-[#FF3B30] px-2 py-1 text-xs font-medium tracking-wider text-[#ff3b30] transition-all duration-300 hover:bg-red-100"
                      >
                        DELETE
                      </button>
                    </div>
                  )}
                </div>

                {/* Acknowledged Label */}
                {review.acknowledged && (
                  <div
                    data-aos="fade-left"
                    data-aos-anchor="#example-anchor"
                    data-aos-offset="500"
                    data-aos-duration="500"
                    className="absolute right-0 top-[12px] rounded-bl-md rounded-tl-md bg-blue-500 px-2 py-1 text-sm font-medium tracking-widest text-white"
                  >
                    ACKNOWLEDGED
                  </div>
                )}

                {/* OWNER REPLY */}
                {review.replies.length > 0 && (
                  <div className="mt-4">
                    {review.replies.map((reply, index) => (
                      <div key={index} className="rounded-md bg-blue-50 p-2">
                        <p className="flex flex-wrap items-center gap-1 text-sm font-normal leading-[1.6] text-gray-800">
                          {reply.reply}
                          <span className="text-sm font-semibold leading-[1.6] text-gray-800">
                            - {reply.name}
                          </span>
                        </p>

                        {/* <p className="text-xs text-gray-500">{reply.name} - {new Date(reply.createdAt).toLocaleString()}</p> */}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <h2 className="mt-8 rounded-lg border border-blue-500 p-2 text-center">
          No Reviews Available
        </h2>
      )}

      <LoadMore
        loadMoreReviews={loadMoreReviews}
        hasMore={pageNumber < totalPages}
        isFetching={isFetching}
      />

      {isLoggedIn && deleteModal && (
        <DeleteReviewModal
          onDelete={handleDeleteReview} // Pass delete function
          onClose={toggleDeleteReviewModal}
          reviewId={selectedReviewId}
        />
      )}

      {isLoggedIn && replyModal && (
        <ReplyReviewModal
          onClose={toggleReplyReviewModal}
          reviewId={selectedReviewId}
          reviewerName={
            allReviews.find((review) => review._id === selectedReviewId)?.name
          }
          onReplySubmit={handleReplySubmit}
        />
      )}
    </div>
  );
};

export default AllReviews;
