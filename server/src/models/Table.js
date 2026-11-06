import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true, trim: true, uppercase: true, match: /^[A-Z0-9-]{1,10}$/ },
    label: { type: String, trim: true, maxlength: 40 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Table", tableSchema);