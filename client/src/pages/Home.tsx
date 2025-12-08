import { ReviewForm } from "../components/ReviewForm";
import { useEffect, useRef, useState } from "react";
import { RootState } from "../types";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Hero from "@/sections/Hero";
import FeaturedReviews from "@/sections/FeaturedReviews";
import Header from "@/components/Header";
import FAQ from "@/sections/FAQ";
import { io, Socket } from "socket.io-client"; // Import Socket.IO
import AllReviews from "@/sections/AllReviews";
import { useGetReviewsQuery } from "@/slices/reviewsApiSlice";
import { useDispatch } from "react-redux";
import { addNotification } from "@/slices/notificationsSlice";

const Home = () => {
  const { adminToken: isLoggedIn } = useSelector(
    (state: RootState) => state.auth,
  );

  // State to manage the current page number for pagination
  const [pageNumber, setPageNumber] = useState(1);

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
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      // Connect to the server
      socket.current = io("http://localhost:5000"); // Ensure this matches your server URL
      // socket.current = io("https://fars-v1.onrender.com/"); // Ensure this matches your server URL

      socket.current.on("connect_error", (err) => {
        console.error("Connection error:", err);
      });

      // Listen for new reviews from the server
      socket.current.on("newReview", (review) => {
        dispatch(
          addNotification({
            name: review.name,
            createdAt: review.createdAt,
            feedback: review.feedback,
          }),
        );
        toast.success(`${review.name} has added a review !`);
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
        className="border-b bg-[#f0f4ff] pt-20 xl:pt-28"
      >
        <Hero onGetStartedClick={handleGetStartedClick} />
      </div>

      <div
        ref={feedbackRef}
        id="feedback"
        className="bg-[#f0f4ff] pt-20 xl:pt-24"
      >
        <ReviewForm />
      </div>

      <div ref={featuredReviewsRef} id="featured-reviews">
        <FeaturedReviews />
      </div>

      <div ref={allReviewsRef} id="all-reviews">
        <AllReviews
          data={data}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          reviewsError={reviewsError}
          isLoggedIn={isLoggedIn}
          setPageNumber={setPageNumber}
          pageNumber={pageNumber}
        />
      </div>

      <div ref={faqRef} id="FAQs">
        <FAQ />
      </div>
    </div>
  );
};

export default Home;
