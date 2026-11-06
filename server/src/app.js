import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { globalLimiter } from "./middleware/rateLimiters.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import AppError from "./utils/AppError.js";

const app = express();

// Render jaise proxy ke peeche asli client IP padhne ke liye (rate limit sahi chale).
if (env.nodeEnv === "production") app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || env.clientUrls.includes(origin)) return cb(null, true);
      cb(new AppError("Origin not allowed by CORS", 403));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.use("/api", globalLimiter, routes);

app.use(notFound);
app.use(errorHandler);

export default app;