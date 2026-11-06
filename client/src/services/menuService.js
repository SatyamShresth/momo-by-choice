import { api } from "./api.js";

export const getMenu = (signal) => api("/menu", { signal });