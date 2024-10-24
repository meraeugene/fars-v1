import express from "express";
import {
  createReview,
  getAllReviews,
  deleteReview,
  replyToReview,
  likeReview,
  unlikeReview,
  acknowledgeReview,
  getFeaturedReviews,
} from "../controllers/reviewController";
import checkObjectId from "../middlewares/checkObjectId";
import { adminProtect } from "../middlewares/adminProtect";

const router = express.Router();

// ===================
// Review Routes
// ===================

router.route("/").get(getAllReviews).post(createReview); // Get all reviews and create a new review
router.route("/featured").get(getFeaturedReviews); // Featured reviews
router.put("/:id/like", checkObjectId, likeReview); // Like a review
router.put("/:id/unlike", checkObjectId, unlikeReview); // Unlike a review
router.put("/:id/acknowledge", adminProtect, checkObjectId, acknowledgeReview); // Acknowledge review by admin
router.delete("/:id", adminProtect, checkObjectId, deleteReview); // Delete review
router.post("/:id/reply", adminProtect, checkObjectId, replyToReview); // Reply to a review

export default router;
