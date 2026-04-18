// src/services/apiClient.ts
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export const apiClient = axios.create({
  baseURL: "http://localhost:5294/api",
});

// Interceptor: Tự động nhét Access Token vào mọi Request
apiClient.interceptors.request.use((config) => {
  // Lấy token trực tiếp từ RAM (Zustand)
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
