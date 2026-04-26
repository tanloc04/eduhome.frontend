import { create } from "zustand";
import { persist } from "zustand/middleware"; // 1. Import persist middleware
import { jwtDecode } from "jwt-decode";
import { authService } from "@/services/auth.service";
import type { UserProfile } from "@/types/auth.type";

interface AuthState {
  accessToken: string | null;
  role: string | null;
  isAuthenticated: boolean;
  user: UserProfile | null;

  setAuth: (token: string) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

// 2. Thêm cặp ngoặc () và bọc toàn bộ code cũ vào trong hàm persist()
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      role: null,
      isAuthenticated: false,
      user: null,

      setAuth: (token: string) => {
        try {
          const decoded: any = jwtDecode(token);
          const userRole =
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] ||
            decoded.role ||
            "Student";

          set({ accessToken: token, role: userRole, isAuthenticated: true });
        } catch (error) {
          console.error("Token không hợp lệ", error);
        }
      },

      logout: () => {
        localStorage.removeItem("refreshToken");
        set({
          accessToken: null,
          role: null,
          isAuthenticated: false,
          user: null,
        });
      },

      fetchProfile: async () => {
        try {
          if (get().isAuthenticated && !get().user) {
            const userData = await authService.getProfile();
            set({ user: userData });
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin user", error);
        }
      },
    }),
    {
      name: "auth-storage", // 3. Đặt tên cho cái hộp lưu trữ dưới LocalStorage
    },
  ),
);
