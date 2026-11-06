import rateLimit from "express-rate-limit";

const make = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
  });

const MIN = 60 * 1000;

export const globalLimiter = make(15 * MIN, 600, "Bahut zyada requests. Thodi der baad try karein.");
export const loginLimiter = make(15 * MIN, 10, "Bahut zyada login attempts. 15 minute baad try karein.");
export const reviewLimiter = make(60 * MIN, 10, "Bahut zyada reviews bheje gaye. Thodi der baad try karein.");
export const tableLimiter = make(MIN, 60, "Bahut zyada requests. Thodi der baad try karein.");