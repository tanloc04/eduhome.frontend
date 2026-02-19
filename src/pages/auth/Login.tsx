// src/pages/auth/Login.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Đăng nhập với:", { email, password });
  };

  return (
    <Card className="w-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl">
      <CardHeader className="space-y-3 pb-6 pt-8">
        <CardTitle className="text-3xl font-extrabold text-center text-slate-800 tracking-tight">
          Đăng Nhập
        </CardTitle>
        <CardDescription className="text-center text-slate-600 text-base">
          Hệ thống quản lý Ký túc xá EduHome
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleLogin}>
        {/* Tăng khoảng cách giữa các field bằng space-y-5 */}
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-semibold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              // Thêm chút hiệu ứng khi focus vào input
              className="bg-white/50 focus:bg-white transition-colors py-5 border-slate-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-semibold">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/50 focus:bg-white transition-colors py-5 border-slate-200"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-5 pb-8 pt-4">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl transition-all shadow-md hover:shadow-lg text-md"
          >
            Đăng nhập
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
