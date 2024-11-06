import { InfiniteFeaturedReviews } from "@/components/InfiniteFeaturedReviews";

const FeaturedReviews = () => {
  return (
    <div className="featured-reviews__container bg-[#f0f4ff] pt-20 xl:pt-24">
      <h1 className="h3-bold text-center text-[#0c1b4d]">Featured Reviews</h1>
      <p className="mx-auto mb-4 mt-2 max-w-sm px-10 text-center text-sm text-[#777fa1] dark:text-neutral-300 lg:text-base">
        Hear what our customers are saying about our service!
      </p>

      <div className="lg:mx-16 xl:mx-60">
        <InfiniteFeaturedReviews />
      </div>
    </div>
  );
};

export default FeaturedReviews;
