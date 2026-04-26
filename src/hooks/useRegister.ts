// src/hooks/useRegister.ts
import { useState } from "react";
import { authService } from "@/services/auth.service";
import type { RegisterRequest } from "@/types/auth.type";
export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await authService.register(data);
      setSuccessMsg(response.message);
      return { success: true };
    } catch (err: any) {
      // Xử lý lỗi từ backend C# trả về
      const errorMessage =
        err.response?.data?.message ||
        "Đã có lỗi xảy ra khi kết nối đến máy chủ.";
      setError(errorMessage);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error, successMsg };
};
