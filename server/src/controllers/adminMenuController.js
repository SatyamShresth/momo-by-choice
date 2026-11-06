import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { cloudinaryEnabled } from "../config/cloudinary.js";
import { deleteImage, optimizedUrl, uploadImage } from "../utils/imageStorage.js";

const item = (i) => ({
  id: String(i._id),
  category: String(i.category),
  name: i.name,
  description: i.description || "",
  price: i.price,
  veg: i.veg,
  bestseller: i.bestseller,
  recommended: i.recommended,
  available: i.available,
  image: i.image || "",
});

const cat = (c) => ({ id: String(c._id), name: c.name, isActive: c.isActive });

const nextSort = async (Model) => {
  const last = await Model.findOne().sort({ sortOrder: -1 }).select("sortOrder").lean();
  return (last?.sortOrder ?? 0) + 1;
};

const assertCategory = async (id) => {
  if (!(await Category.exists({ _id: id }))) throw new AppError("Category nahi mili", 400);
};

export const listAdminMenu = asyncHandler(async (_req, res) => {
  const [categories, items] = await Promise.all([
    Category.find().sort({ sortOrder: 1, name: 1 }).lean(),
    MenuItem.find().sort({ sortOrder: 1, name: 1 }).lean(),
  ]);
  res.json({ success: true, data: { categories: categories.map(cat), items: items.map(item) } });
});

export const createItem = asyncHandler(async (req, res) => {
  await assertCategory(req.body.category);
  const created = await MenuItem.create({ ...req.body, sortOrder: await nextSort(MenuItem) });
  res.status(201).json({ success: true, data: { item: item(created) } });
});

export const updateItem = asyncHandler(async (req, res) => {
  if (req.body.category) await assertCategory(req.body.category);
  const updated = await MenuItem.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
  if (!updated) throw new AppError("Item nahi mila", 404);
  res.json({ success: true, data: { item: item(updated) } });
});

// export const deleteItem = asyncHandler(async (req, res) => {
//   const removed = await MenuItem.findByIdAndDelete(req.params.id);
//   if (!removed) throw new AppError("Item nahi mila", 404);
//   res.json({ success: true, data: { id: req.params.id } });
// });

export const deleteItem = asyncHandler(async (req, res) => {
  const removed = await MenuItem.findByIdAndDelete(req.params.id);
  if (!removed) throw new AppError("Item nahi mila", 404);
  await deleteImage(removed.imagePublicId);
  res.json({ success: true, data: { id: req.params.id } });
});

export const uploadItemImage = asyncHandler(async (req, res) => {
  if (!cloudinaryEnabled) throw new AppError("Photo upload abhi set up nahi hai (Cloudinary keys missing).", 503);
  if (!req.file) throw new AppError("Photo chunein.", 400);

  const doc = await MenuItem.findById(req.params.id);
  if (!doc) throw new AppError("Item nahi mila", 404);

  let result;
  try {
    result = await uploadImage(req.file.buffer);
  } catch (err) {
    console.error("Cloudinary upload failed:", err.message);
    throw new AppError("Photo upload nahi ho payi. Doosri photo try karein.", 502);
  }

  const oldId = doc.imagePublicId;
  doc.image = optimizedUrl(result.secure_url);
  doc.imagePublicId = result.public_id;
  await doc.save();
  await deleteImage(oldId);

  res.json({ success: true, data: { item: item(doc) } });
});

export const removeItemImage = asyncHandler(async (req, res) => {
  const doc = await MenuItem.findById(req.params.id);
  if (!doc) throw new AppError("Item nahi mila", 404);

  const oldId = doc.imagePublicId;
  doc.image = "";
  doc.imagePublicId = "";
  await doc.save();
  await deleteImage(oldId);

  res.json({ success: true, data: { item: item(doc) } });
});

export const createCategory = asyncHandler(async (req, res) => {
  const created = await Category.create({ name: req.body.name, sortOrder: await nextSort(Category) });
  res.status(201).json({ success: true, data: { category: cat(created) } });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const updated = await Category.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
  if (!updated) throw new AppError("Category nahi mili", 404);
  res.json({ success: true, data: { category: cat(updated) } });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  if (await MenuItem.exists({ category: req.params.id })) {
    throw new AppError("Is category mein items hain. Pehle unhe delete karein.", 409);
  }
  const removed = await Category.findByIdAndDelete(req.params.id);
  if (!removed) throw new AppError("Category nahi mili", 404);
  res.json({ success: true, data: { id: req.params.id } });
});