import type { User } from '../types/user.type';

// Lấy Base URL từ biến môi trường hoặc để mặc định
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- Interfaces thao tác với backend ---
export interface LoginRequest {
    email: string;
    password?: string; // Tùy vào luồng đăng nhập của bạn (mật khẩu hoặc OTP/OAuth)
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

/**
 * Hàm tiện ích xử lý gọi API chung (fetch wrapper)
 * Giúp bắt lỗi, tự động nối BASE_URL và gán headers cơ bản
 */
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    try {
        const response = await fetch(url, { ...options, headers });

        // Nếu status code không phải 2xx thì throw lỗi
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Lỗi không xác định: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`[API Error] ${endpoint}:`, error);
        throw error;
    }
}

/**
 * Chứa các logic gọi API liên quan tới Authenticate và Authorize
 */
export const authService = {
    /**
     * Authenticate: Đăng nhập để lấy User và Token
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        return fetchApi<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Đăng ký tài khoản hệ thống
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        return fetchApi<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Authorize: Lấy profile/refresh token thông qua Bearer token (vd: khi user F5 lại trang)
     */
    getProfile: async (token: string): Promise<User> => {
        return fetchApi<User>('/auth/profile', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
};
