import type { User } from "./user.type";

export interface AuthState {
    // Trạng thái (State)
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Hành động (Actions - Bạn sẽ gọi các hàm này từ UI)
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    setLoading: (status: boolean) => void;
}