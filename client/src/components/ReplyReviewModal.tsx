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
          new Event("submit", { cancelable: true, bubbles: true })
        );
    }
  };

  const errorClass =
    "border-red-500 border focus:outline focus:outline-red-200";

  return (
    <div className="overlay fixed inset-0 z-10 bg-[rgba(12,27,77,0.15)] backdrop-blur-[4px] transition-all duration-300">
      <div className="fixed-container z-20 flex-col w-[80%] opacity-100 transition-all duration-300 flex gap-6 lg:w-[50%] xl:w-[20%]">
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
                  className={`border  border-[#1d3b72]  focus:outline-[#1d3b72]  focus:outline-2 rounded-lg px-3 py-2 w-full ${
                    errors.reply && touched.reply ? errorClass : ""
                  }`}
                  onKeyDown={handleKeyDown} // Attach keydown handler here
                />
                <ErrorMessage
                  name="reply"
                  component="div"
                  className="text-red-500 text-base"
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="text-lg rounded-lg mb-4 border border-[#fff] px-4 py-3 bg-[#f4f6fa] text-[#0c1b4d] hover:bg-[#e7e9ea] transition-all duration-300 w-full"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-lg rounded-lg  mb-4  border border-white px-4 py-3 bg-[#0c1b4d] text-white hover:bg-[#09123a] transition-all duration-300 hover:border-white w-full"
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
