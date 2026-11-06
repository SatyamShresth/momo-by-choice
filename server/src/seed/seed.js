import mongoose from "mongoose";
import { env } from "../config/env.js";
import { connectDB } from "../config/db.js";
import Admin from "../models/Admin.js";
import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";
import Table from "../models/Table.js";
import Settings from "../models/Settings.js";

// SAMPLE / DEMO menu. Asli items aur prices admin dashboard se badlenge (Phase 6).
const categories = [
  "Steamed Momos", "Fried Momos", "Tandoori Momos", "Kurkure Momos", "Gravy Momos",
  "Soups", "Chowmein & Rice", "Sides & Dips", "Beverages", "Desserts",
];

// flags: b = bestseller, r = recommended, x = currently unavailable
const m = (category, name, description, price, veg, flags = "") => ({ category, name, description, price, veg, flags });

const items = [
  m("Steamed Momos", "Veg Steamed Momo", "Cabbage, carrot aur herbs ki soft filling. 6 pcs.", 90, true, "b"),
  m("Steamed Momos", "Paneer Steamed Momo", "Masaledaar paneer filling. 6 pcs.", 110, true, "r"),
  m("Steamed Momos", "Chicken Steamed Momo", "Juicy chicken filling, garam parosa jata hai. 6 pcs.", 110, false, "b"),
  m("Fried Momos", "Veg Fried Momo", "Bahar se crispy, andar se rasila. 6 pcs.", 100, true),
  m("Fried Momos", "Chicken Fried Momo", "Crispy fried chicken momo. 6 pcs.", 130, false, "b"),
  m("Tandoori Momos", "Paneer Tandoori Momo", "Smoky tandoori masala mein paneer momo. 6 pcs.", 150, true, "r"),
  m("Tandoori Momos", "Chicken Tandoori Momo", "Tandoor mein sekey hue spicy chicken momo. 6 pcs.", 170, false, "rx"),
  m("Kurkure Momos", "Veg Kurkure Momo", "Extra crunchy coating ke saath. 6 pcs.", 130, true),
  m("Kurkure Momos", "Chicken Kurkure Momo", "Crunchy coating, spicy chicken filling. 6 pcs.", 160, false, "r"),
  m("Gravy Momos", "Chicken Gravy Momo", "Masaledaar gravy mein dube hue momos. 6 pcs.", 170, false),
  m("Gravy Momos", "Veg Gravy Momo", "Tikhi gravy mein veg momos. 6 pcs.", 140, true),
  m("Soups", "Veg Manchow Soup", "Tikha aur garam, crispy noodles ke saath.", 90, true),
  m("Soups", "Chicken Clear Soup", "Halka aur sehat bhara.", 100, false),
  m("Chowmein & Rice", "Veg Hakka Noodles", "Wok mein tosse hue veg noodles.", 110, true),
  m("Chowmein & Rice", "Chicken Fried Rice", "Smoky wok flavour ke saath.", 140, false),
  m("Sides & Dips", "Extra Red Chutney", "Hamari signature red chutney.", 20, true),
  m("Sides & Dips", "Peri Peri Fries", "Crispy fries, peri peri masala ke saath.", 90, true),
  m("Beverages", "Masala Lemon Soda", "Chatpata aur thanda.", 50, true),
  m("Beverages", "Cold Coffee", "Creamy aur thanda.", 80, true),
  m("Desserts", "Chocolate Fried Momo", "Pighli chocolate se bhare crispy momo. 4 pcs.", 110, true, "r"),
];

const TABLE_COUNT = 10;

async function run() {
  await connectDB();

  for (const [i, name] of categories.entries()) {
    await Category.updateOne({ name }, { $setOnInsert: { name, sortOrder: i, isActive: true } }, { upsert: true });
  }
  const cats = await Category.find().lean();
  const idByName = new Map(cats.map((c) => [c.name, c._id]));

  for (const [i, it] of items.entries()) {
    const category = idByName.get(it.category);
    await MenuItem.updateOne(
      { category, name: it.name },
      {
        $setOnInsert: {
          category, name: it.name, description: it.description, price: it.price, veg: it.veg,
          bestseller: it.flags.includes("b"), recommended: it.flags.includes("r"),
          available: !it.flags.includes("x"), isActive: true, sortOrder: i,
        },
      },
      { upsert: true }
    );
  }

  for (let n = 1; n <= TABLE_COUNT; n++) {
    await Table.updateOne(
      { number: String(n) },
      { $setOnInsert: { number: String(n), label: `Table ${n}`, isActive: true } },
      { upsert: true }
    );
  }

  await Settings.getMain();

  if (env.adminEmail && env.adminPassword) {
    const email = env.adminEmail.toLowerCase();
    if (await Admin.findOne({ email })) {
      console.log(`Admin already exists: ${email}`);
    } else {
      await Admin.create({ name: "Owner", email, password: env.adminPassword, role: "admin" });
      console.log(`Admin created: ${email}`);
    }
  } else {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set, admin user skipped.");
  }

  console.log(`Seed done: ${categories.length} categories, ${items.length} items, ${TABLE_COUNT} tables.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});