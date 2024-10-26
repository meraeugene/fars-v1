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
      <div className="fixed-container z-20 flex-col w-[80%] md:w-[40%] opacity-100 transition-all duration-300 bg-white p-4 border-blue-900 border rounded-lg flex gap-6 lg:w-[30%] xl:w-[15%]">
        <h1 className="lg:text-base">
          Are you sure you want to delete this review?
        </h1>

        <div className="flex items-center justify-between">
          <div></div>
          <div className="flex gap-2">
            <button
              className="border-blue-500 hover:bg-blue-100 duration-300 transition-all font-medium text-blue-600 border rounded-sm px-4 py-2 text-sm  tracking-wider"
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
              className="border-[#FF3B30] border hover:bg-red-100 duration-300 transition-all rounded-sm px-4 py-2 text-sm text-[#ff3b30] font-medium tracking-wider"
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
