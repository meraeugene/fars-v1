import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useCreateReviewMutation } from "../slices/reviewsApiSlice";
import { useUploadSingleImageMutation } from "@/slices/uploadsApiSlice";
import { GrFormUpload } from "react-icons/gr";

interface FormValues {
  name: string;
  rating: number;
  feedback: string;
  image: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .max(50, "Name must be at most 50 characters"),
  rating: Yup.number()
    .required("Rating is required")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  feedback: Yup.string().required("Feedback is required"),
});

export function ReviewForm() {
  const [createReview, { isLoading: loadingCreateReview }] =
    useCreateReviewMutation();

  // IMAGE UPLOAD FEATURE
  const [image, setImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>("");

  const [uploadProductImage, { isLoading: uploadingImage }] =
    useUploadSingleImageMutation({});

  const handleImageUploadAndPreview = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set image preview
    setImagePreview(URL.createObjectURL(file));

    // Prepare form data for the upload
    const formData = new FormData();
    formData.append("image", file);

    try {
      // Upload the image
      const response = await uploadProductImage(formData).unwrap();
      toast.success(response.message);

      // Store the uploaded image's URL or filename
      setImage(response.image);
    } catch (error) {
      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (
    values: FormValues,
    { resetForm, setFieldValue }: FormikHelpers<FormValues>,
  ) => {
    const data = {
      ...values,
      rating: Number(values.rating),
      image,
    };

    try {
      await createReview(data).unwrap();

      resetForm();
      setImage(""); // Clear the image state
      setImagePreview(""); // Clear the image preview
      setFieldValue("image", ""); // Clear the Formik image field
    } catch (error) {
      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  const errorClass =
    "border-red-500 border focus:outline focus:outline-red-200";

  return (
    <div className="mx-auto w-full max-w-md rounded-none px-5 md:rounded-2xl">
      <h2 className="h3-bold text-center font-bold text-[#0c1b4d]">
        Your Feedback
      </h2>
      <p className="mt-2 max-w-sm text-center text-sm text-[#333f61] lg:text-base">
        We value your feedback! Help us improve our service by sharing your
        thoughts.
      </p>

      <Formik
        initialValues={{
          name: "",
          rating: 0,
          feedback: "",
          image: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, errors, touched }) => (
          <Form className="mt-10">
            <div className="mb-6 flex flex-col space-y-4 md:mb-8 md:space-y-4">
              <label htmlFor="name" className="flex flex-col gap-2">
                Name
                <Field
                  id="name"
                  name="name"
                  placeholder="Tyler Durden"
                  type="text"
                  className={`flex h-[45px] w-full rounded-md border border-[#4a71ff] bg-[#fff] px-3 text-sm text-black shadow-xl shadow-blue-100 focus:outline focus:outline-2 focus:outline-blue-400 dark:bg-zinc-800 dark:text-white ${errors.name && touched.name ? errorClass : ""} `}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-red-500"
                />
              </label>

              <label htmlFor="rating" className="flex flex-col gap-2">
                Rating
                <Field
                  as="select"
                  name="rating"
                  id="rating"
                  className={`flex h-[45px] w-full items-center justify-center rounded-md border border-[#4a71ff] bg-[#fff] px-3 text-sm shadow-xl shadow-blue-100 focus:outline focus:outline-2 focus:outline-blue-400 ${errors.rating && touched.rating ? errorClass : ""}`}
                >
                  <option className="text-black" value="" hidden>
                    Select Rating
                  </option>
                  <option className="text-black" value="5">
                    5 - Excellent
                  </option>
                  <option className="text-black" value="4">
                    4 - Very Good
                  </option>
                  <option className="text-black" value="3">
                    3 - Good
                  </option>
                  <option className="text-black" value="2">
                    2 - Fair
                  </option>
                  <option className="text-black" value="1">
                    1 - Poor
                  </option>
                </Field>
                <ErrorMessage
                  name="rating"
                  component="div"
                  className="text-sm text-red-500"
                />
              </label>

              <label className="flex flex-col gap-2">
                Feedback
                <Field
                  as="textarea"
                  style={{ height: "auto" }}
                  rows={5}
                  placeholder="Share your love! Tell us what you thought about our service in a quick review."
                  name="feedback"
                  className={`flex h-10 w-full rounded-md border border-[#4a71ff] bg-[#fff] px-3 py-2 text-sm text-black shadow-xl shadow-blue-100 focus:outline focus:outline-2 focus:outline-blue-400 dark:bg-zinc-800 dark:text-white ${errors.feedback && touched.feedback ? errorClass : ""}`}
                />
                <ErrorMessage
                  name="feedback"
                  component="div"
                  className="text-sm text-red-500"
                />
              </label>

              {/* Image Upload */}
              <label className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  Image{" "}
                  <span className="text-xs text-neutral-600">(optional)</span>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleImageUploadAndPreview(e);
                    setFieldValue("image", e.target.files?.[0]); // Store the file in Formik state
                  }}
                  className="hidden" // Hide the default file input
                  id="image-upload" // Add an ID for the label to associate with the input
                />

                <label
                  htmlFor="image-upload"
                  className="shadowb-blue-100 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#4a71ff] bg-[#fff] px-3 py-3 text-center text-sm text-gray-500 shadow-xl hover:bg-blue-50"
                >
                  <GrFormUpload fontSize={20} />
                  Choose an image
                </label>

                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      className="h-auto w-full rounded-md shadow-lg"
                    />
                  </div>
                )}
              </label>
            </div>

            <button
              className="cta-button"
              type="submit"
              aria-label="submit-review"
              disabled={isSubmitting || uploadingImage}
            >
              {uploadingImage ? (
                // Check if the image is uploading
                <div className="flex items-center justify-center gap-3">
                  <span className="text-sm text-white">Uploading Image</span>
                  <l-line-spinner
                    size="16"
                    stroke="3"
                    speed="1"
                    color="#fff"
                  ></l-line-spinner>
                </div>
              ) : loadingCreateReview ? (
                // Check if the review is being created
                <div className="flex items-center justify-center gap-3">
                  <l-line-spinner
                    size="16"
                    stroke="3"
                    speed="1"
                    color="#fff"
                  ></l-line-spinner>
                </div>
              ) : (
                <span>Submit Feedback</span>
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
