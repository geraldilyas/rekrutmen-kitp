import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Backend origin without the "/api" suffix, for linking to files under /storage.
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export const storageUrl = (path: string | null | undefined) =>
  path ? `${API_ORIGIN}/storage/${path}` : "";

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");


  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
  }

  return config;
});