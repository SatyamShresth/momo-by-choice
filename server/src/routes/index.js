import { Router } from "express";
import mongoose from "mongoose";
import { protect, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginLimiter, reviewLimiter } from "../middleware/rateLimiters.js";
import {
  categoryCreateBody, categoryUpdateBody, idParams, itemCreateBody, itemUpdateBody,
  loginBody, reviewAdminQuery, reviewBody, reviewListQuery, reviewStatusBody, settingsBody,
} from "../validators/schemas.js";
import { getMenu } from "../controllers/menuController.js";
import { createReview, listReviews } from "../controllers/reviewController.js";
import { login, me } from "../controllers/authController.js";
import { getSettings } from "../controllers/settingsController.js";
import {
  createCategory, createItem, deleteCategory, deleteItem, listAdminMenu, updateCategory, updateItem,
} from "../controllers/adminMenuController.js";
import { deleteReview, listAdminReviews, updateReviewStatus } from "../controllers/adminReviewController.js";
import { getAdminSettings, updateSettings } from "../controllers/adminSettingsController.js";
import { imageUpload } from "../middleware/upload.js";

const router = Router();

/* ---------- Public ---------- */
router.get("/health", (_req, res) =>
  res.json({ success: true, data: { status: "ok", db: mongoose.connection.readyState === 1 } })
);
router.get("/menu", getMenu);
router.get("/settings", getSettings);
router.get("/reviews", validate({ query: reviewListQuery }), listReviews);
router.post("/reviews", reviewLimiter, validate({ body: reviewBody }), createReview);

/* ---------- Auth ---------- */
router.post("/auth/login", loginLimiter, validate({ body: loginBody }), login);
router.get("/auth/me", protect, me);

/* ---------- Admin (sab protected) ---------- */
const admin = Router();
admin.use(protect, requireRole("admin"));

admin.get("/menu", listAdminMenu);
admin.post("/menu/items", validate({ body: itemCreateBody }), createItem);
admin.patch("/menu/items/:id", validate({ params: idParams, body: itemUpdateBody }), updateItem);
admin.delete("/menu/items/:id", validate({ params: idParams }), deleteItem);

admin.post("/menu/categories", validate({ body: categoryCreateBody }), createCategory);
admin.patch("/menu/categories/:id", validate({ params: idParams, body: categoryUpdateBody }), updateCategory);
admin.delete("/menu/categories/:id", validate({ params: idParams }), deleteCategory);

admin.get("/reviews", validate({ query: reviewAdminQuery }), listAdminReviews);
admin.patch("/reviews/:id", validate({ params: idParams, body: reviewStatusBody }), updateReviewStatus);
admin.delete("/reviews/:id", validate({ params: idParams }), deleteReview);

admin.get("/settings", getAdminSettings);
admin.put("/settings", validate({ body: settingsBody }), updateSettings);

router.use("/admin", admin);

export default router;