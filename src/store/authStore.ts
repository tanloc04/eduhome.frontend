import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState } from '@/types/auth.type';

// 2. Khởi tạo Zustand Store, sử dụng middleware "persist" để lưu vào localStorage
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Giá trị mặc định ban đầu
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            // Hàm để set thông tin đăng nhập thành công
            setAuth: (user, token) =>
                set({
                    user,
                    token,
                    isAuthenticated: true
                }),

            // Hàm để đăng xuất
            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                }),

            // Hàm để set trạng thái loading (khi đang call API)
            setLoading: (status) =>
                set({
                    isLoading: status
                }),
        }),
        {
            name: 'eduhome-auth-storage', // Tên key lưu trong localStorage
            storage: createJSONStorage(() => localStorage),
            // Chỉ lưu trữ token và thông tin user, không cần lưu isLoading
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
