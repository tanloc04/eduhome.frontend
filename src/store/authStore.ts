// src/store/useAuthStore.ts
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Khởi tạo ban đầu là null (lưu trong RAM)
  accessToken: null,
  isAuthenticated: false,

  // Hàm gọi khi Login thành công hoặc khi Refresh Token thành công
  setAuth: (token: string) =>
    set({
      accessToken: token,
      isAuthenticated: true,
    }),

  // Hàm đăng xuất: Xóa RAM và dọn luôn localStorage
  logout: () => {
    localStorage.removeItem("refreshToken");
    set({ accessToken: null, isAuthenticated: false });
  },
}));
