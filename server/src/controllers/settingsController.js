import Settings from "../models/Settings.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getSettings = asyncHandler(async (_req, res) => {
  const s = await Settings.getMain();
  const { name, tagline, description, address, phone, email, mapsLink, mapsEmbed, hours } = s.toObject();
  res.json({ success: true, data: { name, tagline, description, address, phone, email, mapsLink, mapsEmbed, hours } });
});