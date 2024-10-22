import { InfiniteFeaturedReviews } from "@/components/InfiniteFeaturedReviews";

const FeaturedReviews = () => {
  return (
    <div className="featured-reviews__container pt-16 border-t">
      <h1 className="h3-bold text-center">Featured Reviews</h1>
      <p className="text-neutral-600 text-center text-sm mb-4 mt-2 max-w-sm dark:text-neutral-300 px-10">
        Hear what our customers are saying about our service!
      </p>

      <InfiniteFeaturedReviews />
    </div>
  );
};

export default FeaturedReviews;
