import mongoose, { Schema, Document } from "mongoose";

// Define Reply type for reuse and clarity
interface Reply {
  name: string;
  reply: string;
  createdAt?: Date;
}

// Define the ReviewDocument interface extending mongoose.Document
interface ReviewDocument extends Document {
  name: string;
  rating: number;
  feedback: string;
  likes: number;
  image: string | null;
  acknowledged: boolean;
  replies: Reply[]; // Array of Reply objects
}

// Create the Review Schema
const reviewSchema = new Schema<ReviewDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    image: {
      type: String,
      required: false,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0, // Ensures likes don't go negative
    },
    acknowledged: {
      type: Boolean,
      default: false,
    },
    replies: [
      {
        name: { type: String, required: true, trim: true, maxlength: 100 },
        reply: { type: String, required: true, trim: true, maxlength: 500 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create the Review model
const Review = mongoose.model<ReviewDocument>("Review", reviewSchema);

export default Review;
