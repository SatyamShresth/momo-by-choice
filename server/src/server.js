import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import app from "./app.js";

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});

try {
  await connectDB();
  app.listen(env.port, () => console.log(`API running on http://localhost:${env.port}/api`));
} catch (err) {
  console.error("Failed to start server:", err.message);
  process.exit(1);
}