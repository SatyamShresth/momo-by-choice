import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: { validator: Number.isInteger, message: "Rating must be a whole number" },
    },
    text: { type: String, required: true, trim: true, minlength: 10, maxlength: 500 },
    status: { type: String, enum: ["approved", "hidden"], default: "approved", index: true },
    ipHash: { type: String, select: false, index: true },
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    moderatedAt: Date,
  },
  { timestamps: true }
);

reviewSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Review", reviewSchema);