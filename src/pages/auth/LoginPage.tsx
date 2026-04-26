// src/pages/auth/Login.tsx
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/authStore";

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
import { useLogin } from "@/hooks/useLogin";

// 1. Khai báo Schema Validation bằng Zod
const loginSchema = z.object({
  studentCode: z.string().min(1, "Vui lòng nhập mã sinh viên"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    const result = await login(data);

    if (result.success) {
      const currentRole = useAuthStore.getState().role;

      if (currentRole === "Admin" || currentRole === "BuildingManager") {
        navigate("/admin/dashboard");
      } else if (currentRole === "Accountant") {
        navigate("/accountant/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    }
  };

  return (
    <Card className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl">
      <CardHeader className="space-y-3 pb-6 pt-8 sm:pt-10 sm:pb-8">
        <CardTitle className="text-3xl sm:text-4xl font-extrabold text-center text-slate-800 tracking-tight">
          Đăng Nhập
        </CardTitle>
        <CardDescription className="text-center text-slate-600 text-sm sm:text-base">
          Hệ thống quản lý Ký túc xá EduHome
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5 px-6 sm:px-8">
          {/* Box báo lỗi từ API (VD: Sai pass, không tìm thấy user) */}
          {error && (
            <div className="p-3 text-sm font-medium text-red-600 bg-red-100 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="studentCode"
              className="text-slate-700 font-semibold"
            >
              Student Code
            </Label>
            <Input
              id="studentCode"
              type="studentCode"
              placeholder="VD: SE001..."
              {...register("studentCode")}
              className="bg-white/50 focus:bg-white transition-colors py-5 border-slate-200"
            />
            {errors.studentCode && (
              <p className="text-xs text-red-500 font-medium">
                {errors.studentCode.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-semibold">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className="bg-white/50 focus:bg-white transition-colors py-5 border-slate-200"
            />
            {errors.password && (
              <p className="text-xs text-red-500 font-medium">
                {errors.password.message}
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
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>

          <div className="text-sm text-center text-slate-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-bold hover:underline hover:text-blue-700 transition-colors"
            >
              Đăng ký ngay
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
