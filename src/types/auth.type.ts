// src/types/auth.types.ts

export interface RegisterRequest {
  studentCode: string;
  fullName: string;
  email: string;
  major: string;
  dateOfBirth: string; // Định dạng ISO string (YYYY-MM-DD)
  gender: boolean; // true: Nam, false: Nữ (Giả định theo chuẩn chung)
  phoneNumber: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

// Thêm 2 interface này vào dưới cùng của file
export interface LoginRequest {
  studentCode: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  // Có thể có thêm thông tin user tùy theo BE của bạn trả về
}
