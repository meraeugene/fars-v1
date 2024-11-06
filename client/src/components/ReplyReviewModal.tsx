import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAddReplyToReviewMutation } from "@/slices/reviewsApiSlice";
import { ErrorResponse } from "@/types";

interface ReplyModalProps {
  onClose: () => void;
  reviewId: string;
  reviewerName?: string;
  onReplySubmit: (reply: string) => void;
}

interface ReplyFormValues {
  reply: string;
}

// Yup validation schema
const validationSchema = Yup.object({
  reply: Yup.string().required("Reply is required"),
});

const ReplyReviewModal = ({
  onClose,
  reviewId,
  reviewerName,
  onReplySubmit,
}: ReplyModalProps) => {
  const [addReplyToReview, { isLoading: loadingReplyToReview }] =
    useAddReplyToReviewMutation();

  const handleSubmit = async (values: ReplyFormValues, { resetForm }: any) => {
    const data = { reply: values.reply, reviewId, name: "Owner" };

    try {
      const response = await addReplyToReview(data).unwrap();
      onReplySubmit(values.reply); // Use values.reply here
      toast.success(response.message);
      resetForm();
      onClose();
    } catch (error) {
      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      (e.target as HTMLFormElement)
        .closest("form")
        ?.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true }),
        );
    }
  };

  const errorClass =
    "border-red-500 border focus:outline focus:outline-red-200";

  return (
    <div className="overlay fixed inset-0 z-10 bg-[rgba(12,27,77,0.15)] backdrop-blur-[4px] transition-all duration-300">
      <div className="fixed-container z-20 flex w-[80%] flex-col gap-6 opacity-100 transition-all duration-300 lg:w-[50%] xl:w-[20%]">
        <Formik
          initialValues={{ reply: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div className="flex flex-col gap-2">
                <Field
                  as="textarea"
                  name="reply"
                  id="reply"
                  rows={5}
                  placeholder={`Replying to ${reviewerName || "this review"}`} // Dynamic placeholder
                  className={`w-full rounded-lg border border-[#1d3b72] px-3 py-2 focus:outline-2 focus:outline-[#1d3b72] ${
                    errors.reply && touched.reply ? errorClass : ""
                  }`}
                  onKeyDown={handleKeyDown} // Attach keydown handler here
                />
                <ErrorMessage
                  name="reply"
                  component="div"
                  className="text-base text-red-500"
                />
              </div>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  type="button"
                  className="mb-4 w-full rounded-lg border border-[#fff] bg-[#f4f6fa] px-4 py-3 text-lg text-[#0c1b4d] transition-all duration-300 hover:bg-[#e7e9ea]"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mb-4 w-full rounded-lg border border-white bg-[#0c1b4d] px-4 py-3 text-lg text-white transition-all duration-300 hover:border-white hover:bg-[#09123a]"
                  disabled={isSubmitting || loadingReplyToReview} // Disable if submitting or loading
                >
                  {loadingReplyToReview ? ( // Check if the review is being created
                    <div className="flex items-center justify-center gap-3">
                      <l-line-spinner
                        size="20"
                        stroke="3"
                        speed="1"
                        color="white"
                      ></l-line-spinner>
                    </div>
                  ) : (
                    <span>Submit Reply</span>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ReplyReviewModal;
