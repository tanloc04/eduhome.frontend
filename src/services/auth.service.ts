// src/services/auth.service.ts
import axios from "axios";
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  UserProfile,
} from "@/types/auth.type";
import { apiClient } from "./apiClient";

// Lấy base URL từ cấu hình (tạm thời hardcode theo Swagger của bạn, sau này nên chuyển vào file .env)
const API_BASE_URL = "http://localhost:5294/api";

export const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(
      `${API_BASE_URL}/Auth/register`,
      data,
    );
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/Auth/login`,
      data,
    );
    return response.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>("/Auth/profile");
    return response.data;
  },
};
