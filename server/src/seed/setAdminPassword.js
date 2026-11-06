import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Admin from "../models/Admin.js";

const [email, password] = process.argv.slice(2);

if (!email || !password) {
  console.error("Use: npm run set-password -- <email> <new-password>");
  process.exit(1);
}
if (password.length < 12) {
  console.error("Password kam se kam 12 characters ka rakhein.");
  process.exit(1);
}

await connectDB();
const admin = await Admin.findOne({ email: email.toLowerCase() });
if (!admin) {
  console.error("Is email ka admin nahi mila.");
  await mongoose.disconnect();
  process.exit(1);
}
admin.password = password; // model save par khud hash karta hai
await admin.save();
console.log(`Password update ho gaya: ${admin.email}`);
await mongoose.disconnect();