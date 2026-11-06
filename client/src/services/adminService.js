import { api } from "./api.js";

export const login = (email, password) => api("/auth/login", { method: "POST", body: { email, password } });
export const getMe = (token) => api("/auth/me", { token });

/* Menu */
export const getAdminMenu = (token) => api("/admin/menu", { token });
export const createItem = (token, body) => api("/admin/menu/items", { method: "POST", body, token });
export const updateItem = (token, id, body) => api(`/admin/menu/items/${id}`, { method: "PATCH", body, token });
export const deleteItem = (token, id) => api(`/admin/menu/items/${id}`, { method: "DELETE", token });
export const createCategory = (token, body) => api("/admin/menu/categories", { method: "POST", body, token });
export const deleteCategory = (token, id) => api(`/admin/menu/categories/${id}`, { method: "DELETE", token });

/* Reviews */
export const getAdminReviews = (token, { status = "approved", page = 1, limit = 10 } = {}) =>
// export const getAdminReviews = (token, { status = "pending", page = 1, limit = 10 } = {}) =>
  api(`/admin/reviews?status=${status}&page=${page}&limit=${limit}`, { token });
export const setReviewStatus = (token, id, status) =>
  api(`/admin/reviews/${id}`, { method: "PATCH", body: { status }, token });
export const deleteReview = (token, id) => api(`/admin/reviews/${id}`, { method: "DELETE", token });

/* Settings */
export const getAdminSettings = (token) => api("/admin/settings", { token });
export const updateSettings = (token, body) => api("/admin/settings", { method: "PUT", body, token });