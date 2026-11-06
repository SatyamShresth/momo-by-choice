import Settings from "../models/Settings.js";
import asyncHandler from "../utils/asyncHandler.js";

const shape = (doc) => {
  const o = doc.toObject();
  return {
    name: o.name,
    tagline: o.tagline,
    description: o.description,
    address: o.address,
    phone: o.phone,
    email: o.email,
    mapsLink: o.mapsLink,
    mapsEmbed: o.mapsEmbed,
    siteUrl: o.siteUrl || "",
    hours: o.hours,
  };
};

export const getAdminSettings = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: { settings: shape(await Settings.getMain()) } });
});

export const updateSettings = asyncHandler(async (req, res) => {
  await Settings.getMain(); // document pehle se ho, ye pakka karta hai
  const updated = await Settings.findOneAndUpdate(
    { key: "main" },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  res.json({ success: true, data: { settings: shape(updated) } });
});