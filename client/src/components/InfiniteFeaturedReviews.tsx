import { cn } from "../lib/utils";
import Marquee from "../components/ui/marquee";
import { useGetFeaturedReviewsQuery } from "@/slices/reviewsApiSlice";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { ErrorResponse, Review } from "@/types";
import Loader from "./Loader";

const FeaturedReviewCard = ({
  name,
  feedback,
  rating,
}: {
  _id: string;
  name: string;
  feedback: string;
  rating: number;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border border-[#4a71ff] bg-[#fff] p-4 shadow-xl shadow-blue-100",
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="rating__container flex">
          {Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            return (
              <span key={index}>
                {rating >= starValue ? (
                  <FaStar size={16} color="#ff8873" />
                ) : rating >= starValue - 0.5 ? (
                  <FaStarHalfAlt size={16} color="#ff8873" />
                ) : (
                  <FaRegStar size={16} color="#ff8873" />
                )}
              </span>
            );
          })}
        </div>

        <blockquote className="break-words text-sm">{feedback}</blockquote>
      </div>
      <figcaption className="mt-4 text-sm font-medium text-[#0c1b4d]">
        {name}
      </figcaption>
    </figure>
  );
};

export function InfiniteFeaturedReviews() {
  const {
    data: featuredReviewsData,
    error: errorFeaturedReviews,
    isLoading: loadingFeaturedReviews,
  } = useGetFeaturedReviewsQuery({});

  const error = errorFeaturedReviews as ErrorResponse;

  // You might not need to cast error, unless you have specific handling for ErrorResponse
  const featuredReviews = featuredReviewsData || [];
  const firstRow = featuredReviews.slice(0, featuredReviews.length / 2);
  const secondRow = featuredReviews.slice(featuredReviews.length / 2);

  if (loadingFeaturedReviews) {
    return <Loader />;
  }

  if (errorFeaturedReviews) {
    return (
      <div className="mx-4 mt-8 rounded-lg border border-red-500 p-2 text-center">
        {error?.data?.message || error.error}
      </div>
    );
  }

  return (
    <div className="0 relative mt-8 flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-[#f0f4ff] py-2 lg:border-none">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review: Review) => (
          <FeaturedReviewCard key={review._id} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review: Review) => (
          <FeaturedReviewCard key={review._id} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l"></div>
    </div>
  );
}
