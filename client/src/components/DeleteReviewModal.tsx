interface DeleteModalProps {
  onClose: () => void;
  onDelete: (reviewId: string) => void;
  reviewId: string;
}

const DeleteReviewModal = ({
  onDelete,
  onClose,
  reviewId,
}: DeleteModalProps) => {
  const handleDeleteClick = () => {
    onDelete(reviewId); // Call onDelete with reviewId
  };

  return (
    <div className="overlay fixed inset-0 z-10 bg-[rgba(12,27,77,0.15)] backdrop-blur-[4px] transition-all duration-300">
      <div className="fixed-container z-20 flex w-[80%] flex-col gap-6 rounded-lg border border-blue-900 bg-white p-4 opacity-100 transition-all duration-300 md:w-[40%] lg:w-[30%] xl:w-[15%]">
        <h1 className="lg:text-base">
          Are you sure you want to delete this review?
        </h1>

        <div className="flex items-center justify-between">
          <div></div>
          <div className="flex gap-2">
            <button
              className="rounded-sm border border-blue-500 px-4 py-2 text-sm font-medium tracking-wider text-blue-600 transition-all duration-300 hover:bg-blue-100"
              onClick={() => {
                onClose();
                document.body.classList.remove("menu-open");
              }}
            >
              No
            </button>

            <button
              onClick={() => {
                handleDeleteClick();
                onClose();
                document.body.classList.remove("menu-open");
              }}
              className="rounded-sm border border-[#FF3B30] px-4 py-2 text-sm font-medium tracking-wider text-[#ff3b30] transition-all duration-300 hover:bg-red-100"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteReviewModal;
