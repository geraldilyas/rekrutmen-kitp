import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("=== AXIOS REQUEST ===");
  console.log("Token:", token);
  console.log("URL:", config.url);

  if (token && token !== "undefined" && token !== "null") {
    console.log("Axios Interceptor: Attaching token");
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("Axios Interceptor: No valid token found");
  }

  return config;
});