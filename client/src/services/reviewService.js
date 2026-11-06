import { api } from "./api.js";

export const getReviews = ({ page = 1, limit = 10 } = {}, signal) =>
  api(`/reviews?page=${page}&limit=${limit}`, { signal });

export const createReview = (payload) => api("/reviews", { method: "POST", body: payload });