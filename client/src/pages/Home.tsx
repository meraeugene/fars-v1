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
import ReplyReviewModal from "@/components/ReplyReviewModal";
import FAQ from "@/sections/FAQ";
import { io, Socket } from "socket.io-client"; // Import Socket.IO

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
    refetch,
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
          : review
      )
    );
  };

  // SCROLL SECTION FEATURE
  const featuredReviewsRef = useRef<HTMLDivElement | null>(null);
  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const allReviewsRef = useRef<HTMLDivElement | null>(null);
  const homeRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);

  const handleGetStartedClick = () => {
    // Scroll to the feedback form
    feedbackRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // NOTIFY WHEN NEW REVIEW SUBMITTED
  const socket = useRef<Socket | null>(null); // Define the type of socket ref

  useEffect(() => {
    if (isLoggedIn) {
      // Connect to the server
      socket.current = io("http://localhost:5000"); // Ensure this matches your server URL

      socket.current.on("connect_error", (err) => {
        console.error("Connection error:", err);
      });

      // Listen for new reviews from the server
      socket.current.on("newReview", () => {
        toast.success("Someone has added a new review!");
        refetch();
      });

      // Clean up the socket connection when the component unmounts
      return () => {
        socket.current?.disconnect();
      };
    }
  }, [isLoggedIn]);

  return (
    <div>
      <Header />

      <div
        ref={homeRef}
        id="home"
        className="pt-16 md:pt-20 xl:pt-28 bg-[#f0f4ff] border-b"
      >
        <Hero onGetStartedClick={handleGetStartedClick} />
      </div>

      <div
        ref={feedbackRef}
        id="feedback"
        className="pt-16 bg-[#f0f4ff]  xl:pt-24"
      >
        <ReviewForm />
      </div>

      <div ref={featuredReviewsRef} id="featured-reviews">
        <FeaturedReviews />
      </div>

      <div
        className="reviews__container bg-[#f0f4ff] py-16 pb-0 px-5 md:px-10 lg:px-16 xl:px-60 lg:pt-24 "
        ref={allReviewsRef}
        id="all-reviews"
      >
        <h1 className="h3-bold text-center text-[#0c1b4d]">All Reviews</h1>
        <p className=" text-center text-sm mb-4 mt-2 max-w-sm dark:text-neutral-300 px-10 mx-auto text-[#777fa1] lg:text-base">
          See what all our customers have to say about their experience!
        </p>

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <div className="text-center mt-8 border border-red-500 rounded-lg p-2">
            {error?.data?.message || error.error}
          </div>
        ) : allReviews.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 mt-12 gap-x-8 gap-y-4 xl:columns-4 ">
            {allReviews.map((review) => (
              <div
                className="flex bg-[#fff] flex-col break-inside-avoid mb-8  rounded-xl shadow-xl"
                key={review._id}
                // data-aos="fade-right"
              >
                {review.image && (
                  <div className="review-card-image__container    ">
                    <img
                      src={review.image}
                      alt="image"
                      className="rounded-tr-xl rounded-tl-xl object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div
                  className={` review-card-info__container relative   p-4   ${
                    review.image ? "rounded-tr-none rounded-tl-none" : ""
                  }`}
                >
                  <div className="flex rating__container mb-2">
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
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {/* Reply Button */}
                        <button
                          onClick={() => {
                            setReplyModal(true);
                            setSelectedReviewId(review._id);
                            document.body.classList.add("menu-open");
                          }}
                          className="border-green-700 border rounded-sm py-1 px-2 text-xs text-green-700 font-medium tracking-wider"
                        >
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

                  {/* OWNER REPLY */}
                  {review.replies.length > 0 && (
                    <div className="mt-4">
                      {review.replies.map((reply, index) => (
                        <div key={index} className="bg-blue-50 p-2 rounded-md">
                          <p className="text-sm flex flex-wrap items-center gap-1 text-gray-800 leading-[1.6] font-normal ">
                            {reply.reply}
                            <span className="text-sm text-gray-800 leading-[1.6] font-semibold">
                              - {reply.name}
                            </span>
                          </p>

                          {/* <p className="text-xs text-gray-500">{reply.name} - {new Date(reply.createdAt).toLocaleString()}</p> */}
                        </div>
                      ))}
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

      <div ref={faqRef} id="FAQs">
        <FAQ />
      </div>
    </div>
  );
};

export default Home;
