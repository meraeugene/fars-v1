import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import Review from "../models/reviewModel";
import { io } from "../index";

// @desc Get all reviews with sorting and pagination
// @route GET /api/reviews
// @Public access
const getAllReviews = asyncHandler(async (req: Request, res: Response) => {
  try {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;

    // Count total reviews for pagination purposes
    const totalReviews = await Review.countDocuments({});

    // Fetch reviews with sorting by likes and pagination
    const reviews = await Review.find({})
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.status(200).json({
      reviews,
      page,
      totalPages: Math.ceil(totalReviews / pageSize),
      totalReviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Get featured reviews sorted by likes
// @route GET /api/reviews/featured
// @Public access
const getFeaturedReviews = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Limit to 5 featured reviews
    const featuredReviews = await Review.find({})
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .limit(5); // Limit to 5 reviews

    res.status(200).json(featuredReviews);
  } catch (error) {
    console.error("Error fetching featured reviews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Create a new review
// @route POST /api/reviews
// @Public access
const createReview = asyncHandler(async (req, res) => {
  try {
    const { rating, feedback, name, image } = req.body;

    // Validate input
    if (!rating || !feedback || !name) {
      return res
        .status(400)
        .json({ message: "Please submit a rating, feedback, and a name." });
    }

    // Validate rating
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be a number between 1 and 5." });
    }

    // Create a new review
    const review = new Review({
      name,
      rating: Number(rating),
      feedback,
      image,
    });

    // Save the review
    await review.save();

    // Emit socket event to notify admin
    io.emit("newReview", {
      name: review.name,
      rating: review.rating,
      feedback: review.feedback,
      image: review.image,
    });

    res.status(201).json({ message: "Review submitted successfully." });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Delete a review
// @route DELETE /api/reviews/:id
// @Public access
const deleteReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await Review.deleteOne({ _id: id }); // Using deleteOne instead of remove
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Noted or remove mark as noted from a review
// @route PUT /api/reviews/:id/noted
// @Admin access
const acknowledgeReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { acknowledge } = req.body; // Expecting a boolean in the request body

    // Find the review by ID
    const review = await Review.findById(id);

    // Check if the review exists
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Validate the acknowledge value
    if (acknowledge === undefined) {
      return res
        .status(400)
        .json({ message: "Acknowledgment value is required." });
    }

    // Set the acknowledged status based on the request
    review.acknowledged = acknowledge;

    // Save the updated review
    await review.save();

    // Respond with a success message
    const action = acknowledge ? "acknowledged" : "unacknowledeged";
    res.status(200).json({ message: `Review ${action} successfully.` });
  } catch (error) {
    // Log the error for debugging
    console.error("Error acknowledging review:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Reply to a review
// @route POST /api/reviews/:id/reply
// @Public access
const replyToReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, name } = req.body;

    // Find the review by ID
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Add a new reply (createdAt will be automatically handled by Mongoose)
    review.replies.push({ reply, name });

    // Save the updated review
    await review.save();

    res.status(201).json({ message: "Reply added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Like a review
// @route POST /api/reviews/:id/like
// @Public access
const likeReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Find the review by ID
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Increment the like counter
    review.likes += 1;

    // Save the review
    await review.save();

    res
      .status(200)
      .json({ message: "Review liked successfully", likes: review.likes });
  } catch (error) {
    // Check if error is an instance of Error and handle accordingly
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

// @desc Unlike a review
// @route POST /api/reviews/:id/unlike
// @Public access
const unlikeReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Find the review by ID
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Decrement the like counter
    review.likes = Math.max(0, review.likes - 1);

    // Save the review
    await review.save();

    res
      .status(200)
      .json({ message: "Review unliked successfully", likes: review.likes });
  } catch (error) {
    // Check if error is an instance of Error and handle accordingly
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

export {
  createReview,
  getAllReviews,
  getFeaturedReviews,
  deleteReview,
  acknowledgeReview,
  replyToReview,
  likeReview,
  unlikeReview,
};
