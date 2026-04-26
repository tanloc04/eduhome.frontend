// src/pages/auth/Register.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/useRegister"; // Custom Hook gọi API

// 1. Khai báo Schema Validation bằng Zod (Thêm confirmPassword)
const registerSchema = z
  .object({
    studentCode: z.string().min(1, "Mã sinh viên không được để trống"),
    fullName: z.string().min(1, "Họ tên không được để trống"),
    email: z.string().email("Email không đúng định dạng"),
    major: z.string().min(1, "Ngành học không được để trống"),
    dateOfBirth: z.string().min(1, "Vui lòng chọn ngày sinh"),
    gender: z.string().min(1, "Vui lòng chọn giới tính"),
    phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp!",
    path: ["confirmPassword"], // Trỏ lỗi vào field confirmPassword
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { register, isLoading, error, successMsg } = useRegister();

  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const apiData = {
      ...data,
      gender: data.gender === "true",
      dateOfBirth: new Date(data.dateOfBirth).toISOString(),
    };

    const result = await register(apiData);

    if (result.success) {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  // Class dùng chung cho tất cả các Input để giữ nguyên thiết kế của bạn
  const inputClassName =
    "bg-white/50 focus:bg-white transition-colors py-5 border-slate-200";

  return (
    <Card className="w-full max-w-xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl">
      <CardHeader className="space-y-3 pb-4 pt-8 sm:pt-10 sm:pb-6">
        <CardTitle className="text-3xl sm:text-4xl font-extrabold text-center text-slate-800 tracking-tight">
          Đăng Ký
        </CardTitle>
        <CardDescription className="text-center text-slate-600 text-sm sm:text-base">
          Tạo tài khoản mới cho EduHome
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Thêm max-h để form có thể scroll nếu màn hình nhỏ */}
        <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto px-6 sm:px-8 custom-scrollbar">
          {/* Box thông báo lỗi / thành công */}
          {error && (
            <div className="p-3 text-sm font-medium text-red-600 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg">
              {successMsg}
            </div>
          )}

          {/* Dùng Grid chia 2 cột cho các trường ngắn để form đỡ bị dài */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="studentCode"
                className="text-slate-700 font-semibold"
              >
                Mã sinh viên
              </Label>
              <Input
                id="studentCode"
                placeholder="VD: SE003"
                {...formRegister("studentCode")}
                className={inputClassName}
              />
              {errors.studentCode && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.studentCode.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-slate-700 font-semibold"
              >
                Họ và tên
              </Label>
              <Input
                id="fullName"
                placeholder="Nguyễn Văn A"
                {...formRegister("fullName")}
                className={inputClassName}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-semibold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...formRegister("email")}
              className={inputClassName}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="major" className="text-slate-700 font-semibold">
                Ngành học
              </Label>
              <Input
                id="major"
                placeholder="Khoa Học Máy Tính"
                {...formRegister("major")}
                className={inputClassName}
              />
              {errors.major && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.major.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="phoneNumber"
                className="text-slate-700 font-semibold"
              >
                Số điện thoại
              </Label>
              <Input
                id="phoneNumber"
                placeholder="0999123400"
                {...formRegister("phoneNumber")}
                className={inputClassName}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="dateOfBirth"
                className="text-slate-700 font-semibold"
              >
                Ngày sinh
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...formRegister("dateOfBirth")}
                className={inputClassName}
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-slate-700 font-semibold">
                Giới tính
              </Label>
              <select
                id="gender"
                {...formRegister("gender")}
                // Căn chỉnh select box cho giống style của Input
                className={`flex w-full rounded-md px-3 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${inputClassName}`}
              >
                <option value="">Chọn giới tính</option>
                <option value="true">Nam</option>
                <option value="false">Nữ</option>
              </select>
              {errors.gender && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-semibold">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              {...formRegister("password")}
              className={inputClassName}
            />
            {errors.password && (
              <p className="text-xs text-red-500 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-slate-700 font-semibold"
            >
              Xác nhận mật khẩu
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...formRegister("confirmPassword")}
              className={inputClassName}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-5 pb-8 pt-4 sm:px-8">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl transition-all shadow-md hover:shadow-lg text-md"
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
          <div className="text-sm text-center text-slate-600">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-bold hover:underline hover:text-blue-700 transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
