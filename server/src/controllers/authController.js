import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import Admin from "../models/Admin.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// User na mile tab bhi bcrypt chalta hai, taaki response time se pata na chale ki email exist karta hai.
const DUMMY_HASH = bcrypt.hashSync("timing-attack-protection", 12);

const publicUser = (u) => ({ id: String(u._id), name: u.name, email: u.email, role: u.role });

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password");
  const ok = admin ? await admin.comparePassword(password) : (await bcrypt.compare(password, DUMMY_HASH), false);

  if (!admin || !ok || !admin.isActive) throw new AppError("Invalid email or password", 401);

  const token = jwt.sign({ role: admin.role }, env.jwtSecret, {
    subject: String(admin._id),
    expiresIn: env.jwtExpiresIn,
    algorithm: "HS256",
  });

  res.json({ success: true, data: { token, user: publicUser(admin) } });
});

export const me = (req, res) => res.json({ success: true, data: { user: publicUser(req.user) } });