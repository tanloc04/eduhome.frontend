// src/hooks/useLogin.ts
import { useState } from "react";
import { authService } from "@/services/auth.service";
import type { LoginRequest } from "@/types/auth.type";
import { useAuthStore } from "@/store/authStore";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(data);

      // 1. Lưu Token vào RAM (Zustand) - Đọc từ response.token
      setAuth(response.token);

      // 2. Tạm thời comment/xóa dòng này lại vì BE chưa trả về refreshToken
      // localStorage.setItem("refreshToken", response.refreshToken);

      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Sai thông tin đăng nhập.";
      setError(errorMessage);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
