import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useCreateReviewMutation } from "../slices/reviewsApiSlice";
import { useUploadMultipleImagesMutation } from "@/slices/uploadsApiSlice";
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
  const [fileDetails, setFileDetails] = useState<
    { name: string; size: string }[]
  >([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [uploadMultipleImages] = useUploadMultipleImagesMutation({});

  const handleImageUploadAndPreview = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files) return;

    const details = [];
    const uploaded = [];
    for (const file of Array.from(files)) {
      if (file.type === "image/gif") {
        toast.error("GIF images are not allowed.");
        continue;
      }

      // Add file details
      details.push({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`, // Convert size to MB
      });

      // Upload image
      const formData = new FormData();
      formData.append("images", file);
      try {
        const response = await uploadMultipleImages(formData).unwrap();
        uploaded.push(response.image);
      } catch (error) {
        toast.error("Failed to upload image.");
      }
    }

    setFileDetails(details);
    setUploadedImages(uploaded);
  };

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      await createReview({
        ...values,
        images: uploadedImages,
        rating: Number(values.rating),
      }).unwrap();
      resetForm();
      setFileDetails([]);
      setUploadedImages([]);
      toast.success("Review submitted successfully.");
    } catch (error) {
      toast.error("Failed to submit review.");
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

              {/* Render File Details */}
              {fileDetails.length > 0 && (
                <ul className="mt-3 space-y-2 text-sm">
                  {fileDetails.map((file, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{file.name}</span>
                      <span>{file.size}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* File Upload */}
              <label className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  Image{" "}
                  <span className="text-xs text-neutral-600">(optional)</span>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    handleImageUploadAndPreview(e);
                    setFieldValue("images", e.target.files);
                  }}
                  className="hidden"
                  id="image-upload"
                />

                <label
                  htmlFor="image-upload"
                  className="shadowb-blue-100 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#4a71ff] bg-[#fff] px-3 py-3 text-center text-sm text-gray-500 shadow-xl hover:bg-blue-50"
                >
                  <GrFormUpload fontSize={20} />
                  Choose images
                </label>
              </label>
            </div>

            <button
              className="cta-button"
              type="submit"
              aria-label="submit-review"
              disabled={isSubmitting}
            >
              {loadingCreateReview ? (
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
