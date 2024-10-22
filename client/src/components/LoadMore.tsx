import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface LoadMoreProps {
  loadMoreReviews: () => void; // Function to load more reviews
  hasMore: boolean; // Boolean indicating if there are more reviews to load
  isFetching: boolean; // Boolean indicating if data is currently being fetched
}

const LoadMore = ({ loadMoreReviews, hasMore, isFetching }: LoadMoreProps) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasMore && !isFetching) {
      loadMoreReviews();
    }
  }, [inView, hasMore, isFetching, loadMoreReviews]);

  return (
    <div className="mt-8 flex items-center justify-center" ref={ref}>
      {isFetching && (
        <l-line-spinner
          size="30"
          stroke="3"
          speed="1"
          color="#3b82f6"
        ></l-line-spinner>
      )}
    </div>
  );
};

export default LoadMore;
