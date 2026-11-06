import crypto from "crypto";
import { env } from "../config/env.js";

// IP seedha store nahi karte, sirf uska keyed hash (privacy).
export const hashIp = (ip) =>
  crypto.createHmac("sha256", env.ipHashSecret).update(String(ip || "unknown")).digest("hex");