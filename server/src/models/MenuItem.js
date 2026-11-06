import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 300, default: "" },
    // Price whole rupees mein. Order ka price hamesha yahin se server nikalega.
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 100000,
      validate: { validator: Number.isInteger, message: "Price must be a whole number of rupees" },
    },
    veg: { type: Boolean, required: true },
    bestseller: { type: Boolean, default: false },
    recommended: { type: Boolean, default: false },
    available: { type: Boolean, default: true }, // stock khatam: menu mein dikhe par order na ho
    isActive: { type: Boolean, default: true }, // false = menu se poori tarah hidden
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

menuItemSchema.index({ category: 1, name: 1 }, { unique: true });

export default mongoose.model("MenuItem", menuItemSchema);