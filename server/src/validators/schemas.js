import { z } from "zod";

export const tableParams = z.object({
  number: z.string().trim().regex(/^[A-Za-z0-9-]{1,10}$/, "Invalid table number"),
});

export const reviewListQuery = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

// Sirf ye fields mante hain. "status" jaisi koi extra cheez bheji bhi jaye to zod use hata deta hai.
export const reviewBody = z.object({
  name: z.string({ required_error: "Name is required" }).trim().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters"),
  rating: z.number({ required_error: "Rating is required", invalid_type_error: "Rating must be a number" }).int("Rating must be a whole number").min(1, "Rating must be 1 to 5").max(5, "Rating must be 1 to 5"),
  text: z.string({ required_error: "Review is required" }).trim().min(10, "Review must be at least 10 characters").max(500, "Review must be at most 500 characters"),
  website: z.string().max(200).optional(), // honeypot
});

export const loginBody = z.object({
  email: z.string({ required_error: "Email is required" }).trim().toLowerCase().email("Invalid email").max(120),
  password: z.string({ required_error: "Password is required" }).min(1).max(200),
});

const objectId = z.string().regex(/^[a-f0-9]{24}$/i, "Invalid id");

export const idParams = z.object({ id: objectId });

const itemFields = {
  category: objectId,
  name: z.string().trim().min(2, "Naam kam se kam 2 characters ka ho").max(80, "Naam 80 characters se chhota rakhein"),
  description: z.string().trim().max(300, "Description 300 characters se chhota rakhein"),
  price: z
    .number({ invalid_type_error: "Price number honi chahiye" })
    .int("Price poore rupaye mein likhein")
    .min(0, "Price negative nahi ho sakti")
    .max(100000, "Price bahut zyada hai"),
  veg: z.boolean(),
  bestseller: z.boolean(),
  recommended: z.boolean(),
  available: z.boolean(),
};

export const itemCreateBody = z.object({
  category: itemFields.category,
  name: itemFields.name,
  price: itemFields.price,
  veg: itemFields.veg,
  description: itemFields.description.optional(),
  bestseller: itemFields.bestseller.optional(),
  recommended: itemFields.recommended.optional(),
  available: itemFields.available.optional(),
});

export const itemUpdateBody = z
  .object(itemFields)
  .partial()
  .refine((o) => Object.keys(o).length > 0, "Kuch to badlein");

export const categoryCreateBody = z.object({
  name: z.string().trim().min(2, "Naam kam se kam 2 characters ka ho").max(60, "Naam 60 characters se chhota rakhein"),
});

export const categoryUpdateBody = z
  .object({
    name: z.string().trim().min(2).max(60).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, "Kuch to badlein");

export const reviewAdminQuery = z.object({
  status: z.enum(["approved", "hidden", "all"]).default("approved"),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
export const reviewStatusBody = z.object({
  status: z.enum(["approved", "hidden"]),
});

/* ---------- Restaurant settings ---------- */
const MAPS_HOSTS = ["www.google.com", "google.com", "maps.google.com", "maps.app.goo.gl", "goo.gl"];

const t = (max) => z.string({ required_error: "Ye field zaroori hai" }).trim().max(max, `Maximum ${max} characters`);

// Admin poora <iframe ...> paste kar de to usme se src nikal lete hain.
const extractIframeSrc = (v) => {
  if (typeof v !== "string" || !/<iframe/i.test(v)) return v;
  const m = v.match(/src\s*=\s*["']([^"']+)["']/i);
  return m ? m[1] : v;
};

export const settingsBody = z.object({
  name: t(60).min(2, "Naam kam se kam 2 characters ka ho"),
  tagline: t(120),
  description: t(500),
  address: z.object({
    line1: t(120),
    line2: t(120),
    city: t(60),
    state: t(60),
    pincode: t(10),
  }),
  phone: t(30),
  email: t(120).refine(
    (v) => v === "" || v.startsWith("[") || z.string().email().safeParse(v).success,
    "Sahi email likhein"
  ),
  mapsLink: t(500).refine((v) => {
    if (v === "") return true;
    try {
      const u = new URL(v);
      return u.protocol === "https:" && MAPS_HOSTS.includes(u.hostname);
    } catch {
      return false;
    }
  }, "Google Maps ka https link likhein"),
  mapsEmbed: z.preprocess(
    extractIframeSrc,
    t(1500).refine(
      (v) => v === "" || v.startsWith("https://www.google.com/maps/embed"),
      "Google Maps embed ka link hona chahiye (https://www.google.com/maps/embed...)"
    )
  ),
  siteUrl: t(200)
    .refine((v) => {
      if (v === "") return true;
      try {
        return ["http:", "https:"].includes(new URL(v).protocol);
      } catch {
        return false;
      }
    }, "Sahi website URL likhein (https://...)")
    .transform((v) => (v ? new URL(v).origin : "")),
  hours: z
    .array(z.object({ day: t(40).min(1, "Din likhein"), time: t(40).min(1, "Time likhein") }))
    .max(10, "Maximum 10 rows"),
});