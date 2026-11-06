import Review from "../models/Review.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const shape = (r) => ({
  id: String(r._id),
  name: r.name,
  rating: r.rating,
  text: r.text,
  status: r.status,
  date: r.createdAt,
});

export const listAdminReviews = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const filter = status === "all" ? {} : { status };

  const [docs, total, grouped] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Review.countDocuments(filter),
    Review.aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
  ]);

  const counts = {approved: 0, hidden: 0 };
  grouped.forEach((g) => {
    if (g._id in counts) counts[g._id] = g.n;
  });

  res.json({
    success: true,
    data: {
      reviews: docs.map(shape),
      pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
      counts,
    },
  });
});

export const updateReviewStatus = asyncHandler(async (req, res) => {
  const updated = await Review.findByIdAndUpdate(
    req.params.id,
    { $set: { status: req.body.status, moderatedBy: req.user._id, moderatedAt: new Date() } },
    { new: true }
  );
  if (!updated) throw new AppError("Review nahi mila", 404);
  res.json({ success: true, data: { review: shape(updated) } });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const removed = await Review.findByIdAndDelete(req.params.id);
  if (!removed) throw new AppError("Review nahi mila", 404);
  res.json({ success: true, data: { id: req.params.id } });
});