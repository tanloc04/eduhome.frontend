// src/pages/auth/Register.tsx
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

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    console.log("Đăng ký với:", { fullName, email, password });
    // TODO: Gọi API C# ở đây
  };

  return (
    <Card className="w-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl">
      <CardHeader className="space-y-3 pb-6 pt-8 sm:pt-10 sm:pb-8">
        <CardTitle className="text-3xl sm:text-4xl font-extrabold text-center text-slate-800 tracking-tight">
          Đăng Ký
        </CardTitle>
        <CardDescription className="text-center text-slate-600 text-sm sm:text-base">
          Tạo tài khoản mới cho EduHome
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleRegister}>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-slate-700 font-semibold">
              Họ và tên
            </Label>
            <Input
              id="fullName"
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-white/50 focus:bg-white transition-colors py-5 border-slate-200"
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-700 font-semibold">
              Xác nhận mật khẩu
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            Đăng ký
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
