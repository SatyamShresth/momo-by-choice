import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getMenu = asyncHandler(async (_req, res) => {
  const [categories, items] = await Promise.all([
    Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean(),
    MenuItem.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean(),
  ]);

  const nameById = new Map(categories.map((c) => [String(c._id), c.name]));

  const data = {
    categories: categories.map((c) => c.name),
    items: items
      .filter((i) => nameById.has(String(i.category)))
      .map((i) => ({
        id: String(i._id),
        category: nameById.get(String(i.category)),
        name: i.name,
        description: i.description,
        price: i.price,
        veg: i.veg,
        bestseller: i.bestseller,
        recommended: i.recommended,
        available: i.available,
        image: i.image,
      })),
  };

  res.json({ success: true, data });
});