import { ZodError } from "zod";
import AppError from "../utils/AppError.js";

// Request ko zod schema se check karta hai aur safe (cleaned) values wapas rakhta hai.
export const validate = (schemas) => (req, _res, next) => {
  try {
    for (const key of ["params", "query", "body"]) {
      if (schemas[key]) req[key] = schemas[key].parse(req[key]);
    }
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const details = err.issues.map((i) => ({ field: i.path.join("."), message: i.message }));
      return next(new AppError("Validation failed", 400, details));
    }
    next(err);
  }
};