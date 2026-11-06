import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    name: { type: String, default: "Momo by Choice" },
    tagline: { type: String, default: "Your momo, your way – steamed, fried or tandoori" },
    description: { type: String, default: "[Restaurant description – to be provided]" },
    address: {
      line1: { type: String, default: "[Restaurant address – to be provided]" },
      line2: { type: String, default: "[Area / Landmark]" },
      city: { type: String, default: "[City]" },
      state: { type: String, default: "[State]" },
      pincode: { type: String, default: "[PIN]" },
    },
    phone: { type: String, default: "[Phone number – to be provided]" },
    email: { type: String, default: "[email@example.com]" },
    mapsLink: { type: String, default: "" },
    mapsEmbed: { type: String, default: "" },
    siteUrl: { type: String, default: "" },
    hours: {
      type: [{ _id: false, day: String, time: String }],
      default: [
        { day: "Monday – Friday", time: "[Opening] – [Closing]" },
        { day: "Saturday – Sunday", time: "[Opening] – [Closing]" },
      ],
    },
  },
  { timestamps: true }
);

settingsSchema.statics.getMain = async function () {
  return (await this.findOne({ key: "main" })) || (await this.create({ key: "main" }));
};

export default mongoose.model("Settings", settingsSchema);
