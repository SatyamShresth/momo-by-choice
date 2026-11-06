import Review from "../models/Review.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { hashIp } from "../utils/hashIp.js";

const THANKS = "Shukriya! Aapka review ab website par dikh raha hai.";

export const listReviews = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const filter = { status: "approved" };

  const [docs, total, agg] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Review.countDocuments(filter),
    Review.aggregate([{ $match: filter }, { $group: { _id: null, avg: { $avg: "$rating" } } }]),
  ]);

  res.json({
    success: true,
    data: {
      reviews: docs.map((r) => ({ id: String(r._id), name: r.name, rating: r.rating, text: r.text, date: r.createdAt })),
      pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
      summary: { count: total, average: agg[0] ? Math.round(agg[0].avg * 10) / 10 : 0 },
    },
  });
});

export const createReview = asyncHandler(async (req, res) => {
  const { name, rating, text, website } = req.body;

  // Honeypot: bots ye field bhar dete hain. Chupchap success dikha dete hain, save nahi karte.
  if (website) return res.status(201).json({ success: true, data: { message: THANKS } });

  const ipHash = hashIp(req.ip);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const duplicate = await Review.exists({ ipHash, text, createdAt: { $gte: since } });
  if (duplicate) throw new AppError("Ye review pehle hi bheja ja chuka hai.", 409);

  // status kabhi client se nahi aata: hamesha server tay karta hai.
  await Review.create({ name, rating, text, ipHash, status: "approved" });

  res.status(201).json({ success: true, data: { message: THANKS } });
});