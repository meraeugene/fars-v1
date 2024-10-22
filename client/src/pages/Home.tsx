import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { ReviewForm } from "../components/ReviewForm";
import LoadMore from "../components/LoadMore";
import {
  useGetReviewsQuery,
  useLikeReviewMutation,
  useDislikeReviewMutation,
  useDeleteReviewMutation,
  useAcknowledgeReviewMutation,
} from "../slices/reviewsApiSlice"; // Add hooks for like/dislike
import { useEffect, useRef, useState } from "react";
import { ErrorResponse, Review, RootState } from "../types";
import Loader from "@/components/Loader";
import { PiHeart, PiHeartFill } from "react-icons/pi";
import { toast } from "react-toastify";
import { formatNumber } from "@/utils/formatNumber";
import { useSelector } from "react-redux";
import DeleteReviewModal from "@/components/DeleteReviewModal";
import Hero from "@/sections/Hero";
import FeaturedReviews from "@/sections/FeaturedReviews";
import Header from "@/components/Header";

const Home = () => {
  // State to manage the current page number for pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [allReviews, setAllReviews] = useState<Review[]>([]); // State to store all reviews

  // Fetch reviews from the API using the custom hook
  const {
    data,
    isLoading,
    isError,
    isFetching,
    error: reviewsError,
  } = useGetReviewsQuery({
    pageNumber,
  });

  const [likeReview] = useLikeReviewMutation(); // Mutation hook for liking a review
  const [dislikeReview] = useDislikeReviewMutation(); // Mutation hook for disliking a review

  const error = reviewsError as ErrorResponse;

  // Destructure the reviews and pagination data from API response
  const { reviews = [], totalPages } = data || { reviews: [], totalPages: 1 };

  // Append fetched reviews to existing reviews while filtering out duplicates
  useEffect(() => {
    if (reviews.length > 0) {
      const likedReviews = JSON.parse(
        localStorage.getItem("likedReviews") || "[]"
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
      localStorage.getItem("likedReviews") || "[]"
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
        JSON.stringify([...likedReviews, reviewId])
      );

      // Update the local state to reflect the like
      setAllReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? { ...review, likes: review.likes + 1, liked: true }
            : review
        )
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
      localStorage.getItem("likedReviews") || "[]"
    );

    // Remove the review ID from local storage if it was disliked
    const updatedLikedReviews = likedReviews.filter(
      (id: string) => id !== reviewId
    );
    localStorage.setItem("likedReviews", JSON.stringify(updatedLikedReviews));

    try {
      await dislikeReview({ reviewId }).unwrap();

      // Update the local state to reflect the dislike
      setAllReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? { ...review, likes: Math.max(0, review.likes - 1), liked: false }
            : review
        )
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

  const { adminToken: isLoggedIn } = useSelector(
    (state: RootState) => state.auth
  );

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
        prevReviews.filter((review) => review._id !== reviewId)
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
    acknowledge: boolean
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
            : review
        )
      );
    } catch (error) {
      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  // SCROLL SECTION FEATURE
  const featuredReviewsRef = useRef<HTMLDivElement | null>(null);
  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const allReviewsRef = useRef<HTMLDivElement | null>(null);
  const homeRef = useRef<HTMLDivElement | null>(null);

  const handleGetStartedClick = () => {
    // Scroll to the feedback form
    feedbackRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Header />

      <div ref={homeRef} id="hero" className="pt-16">
        <Hero onGetStartedClick={handleGetStartedClick} />
      </div>

      <div ref={featuredReviewsRef} id="featured-reviews">
        <FeaturedReviews />
      </div>

      <div ref={feedbackRef} id="feedback" className="pt-16">
        <ReviewForm />
      </div>

      <div
        className="reviews__container py-16 px-5"
        ref={allReviewsRef}
        id="all-reviews"
      >
        <h1 className="h3-bold text-center">All Reviews</h1>
        <p className="text-neutral-600 text-center text-sm mb-4 mt-2 max-w-sm dark:text-neutral-300 px-10">
          See what all our customers have to say about their experience!
        </p>

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <div className="text-center mt-8 border border-red-500 rounded-lg p-2">
            {error?.data?.message || error.error}
          </div>
        ) : allReviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 mt-12">
            {allReviews.map((review) => (
              <div
                className="flex flex-col"
                key={review._id}
                data-aos="fade-right"
              >
                {review.image && (
                  <div className="review-card-image__container  border-blue-500 border rounded-tr-lg rounded-tl-lg border-b-0 ">
                    <img
                      src={review.image}
                      alt="image"
                      className="rounded-tr-lg rounded-tl-lg object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div
                  className={` review-card-info__container relative  border-blue-500 p-4 pr-2  border rounded-lg ${
                    review.image ? "rounded-tr-none rounded-tl-none" : ""
                  }`}
                >
                  <div className="flex rating__container mb-2">
                    {Array.from({ length: 5 }, (_, index) => {
                      const starValue = index + 1;
                      return (
                        <span key={index}>
                          {review.rating >= starValue ? (
                            <FaStar size={16} color="#3b82f6" />
                          ) : review.rating >= starValue - 0.5 ? (
                            <FaStarHalfAlt size={16} color="#3b82f6" />
                          ) : (
                            <FaRegStar size={16} color="#3b82f6" />
                          )}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex flex-col gap-3 mt-5 ">
                    <p className="text-sm   text-neutral-600 leading-[1.6] font-normal">
                      {review.feedback}
                    </p>

                    <p className="text-sm  text-neutral-600  leading-[1.6] font-semibold">
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
                      <h3 className="text-sm text-slate-600">LIKE?</h3>

                      <span className="text-sm font-medium text-blue-600">
                        {formatNumber(review.likes)}
                      </span>
                    </div>

                    {isLoggedIn && (
                      <div className="flex gap-2 mt-2">
                        {/* Reply Button */}
                        <button className="border-green-700 border rounded-sm py-1 px-2 text-xs text-green-700 font-medium tracking-wider">
                          REPLY
                        </button>

                        {/* Acknowledge Button */}
                        <button
                          onClick={() =>
                            handleAcknowledgeReview(
                              review._id,
                              !review.acknowledged
                            )
                          }
                          className={`border-blue-500 font-medium text-blue-600 border rounded-sm py-1 px-2 text-xs tracking-wider ${
                            review.acknowledged ? "bg-blue-100" : ""
                          }`}
                        >
                          {review.acknowledged
                            ? "UNACKNOWLEDGE"
                            : "ACKNOWLEDGE"}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            setDeleteModal(true);
                            setSelectedReviewId(review._id);
                            document.body.classList.add("menu-open");
                          }}
                          className="border-[#FF3B30] border rounded-sm py-1 px-2 text-xs text-[#ff3b30] font-medium tracking-wider"
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
                      className="absolute py-1 top-[12px] right-0 bg-blue-500 px-2 text-white rounded-tl-md rounded-bl-md font-medium tracking-widest text-sm"
                    >
                      ACKNOWLEDGED
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h1 className="text-center mt-8 border border-blue-500 rounded-lg p-2">
            No Reviews Available
          </h1>
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
      </div>
    </div>
  );
};

export default Home;
