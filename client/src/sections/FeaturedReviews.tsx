import { InfiniteFeaturedReviews } from "@/components/InfiniteFeaturedReviews";

const FeaturedReviews = () => {
  return (
    <div className="bg-[#f0f4ff] featured-reviews__container pt-16 border-t md:pt-16 xl:pt-24">
      <h1 className="h3-bold text-center text-[#0c1b4d]">Featured Reviews</h1>
      <p className=" text-center text-sm mb-4 mt-2 max-w-sm dark:text-neutral-300 px-10 mx-auto text-[#777fa1] lg:text-base">
        Hear what our customers are saying about our service!
      </p>

      <div className="lg:mx-16 xl:mx-60">
        <InfiniteFeaturedReviews />
      </div>
    </div>
  );
};

export default FeaturedReviews;
