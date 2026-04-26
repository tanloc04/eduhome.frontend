import { useAuthStore } from "@/store/authStore";
import {
  UserCircle,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";

export default function StudentProfile() {
  // Lôi data từ trong kho ra xài luôn, không cần fetch lại!
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        Đang tải thông tin...
      </div>
    );
  }

  // Format ngày sinh từ ISO sang DD/MM/YYYY
  const formattedDob = user.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
    : "Chưa cập nhật";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <UserCircle className="w-7 h-7 text-indigo-600" />
        <h2 className="text-2xl font-bold text-slate-800">Thông tin cá nhân</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CỘT TRÁI: AVATAR & BASIC INFO */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center flex flex-col items-center">
            <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg mb-4">
              <UserIcon className="w-16 h-16 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">
              {user.fullName}
            </h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-200 mb-4">
              <ShieldCheck className="w-4 h-4" />
              Sinh viên Ký túc xá
            </span>
            <div className="w-full h-px bg-slate-100 my-4"></div>
            <div className="text-sm text-slate-500 space-y-2">
              <p>
                Trạng thái tài khoản:{" "}
                <span className="font-bold text-green-600">Đang hoạt động</span>
              </p>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Hồ sơ chi tiết</h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                {/* Mã Sinh Viên */}
                <div>
                  <label className="text-sm font-medium text-slate-500 mb-1 block">
                    Mã sinh viên
                  </label>
                  <div className="flex items-center gap-3 text-slate-800 font-semibold bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                    <UserIcon className="w-5 h-5 text-slate-400" />
                    {user.studentCode}
                  </div>
                </div>

                {/* Chuyên Ngành */}
                <div>
                  <label className="text-sm font-medium text-slate-500 mb-1 block">
                    Chuyên ngành
                  </label>
                  <div className="flex items-center gap-3 text-slate-800 font-medium px-4 py-2.5">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    {user.major || "Chưa cập nhật"}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-slate-500 mb-1 block">
                    Email liên hệ
                  </label>
                  <div className="flex items-center gap-3 text-slate-800 font-medium px-4 py-2.5">
                    <Mail className="w-5 h-5 text-blue-500" />
                    {user.email || "Chưa cập nhật"}
                  </div>
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="text-sm font-medium text-slate-500 mb-1 block">
                    Số điện thoại
                  </label>
                  <div className="flex items-center gap-3 text-slate-800 font-medium px-4 py-2.5">
                    <Phone className="w-5 h-5 text-emerald-500" />
                    {user.phoneNumber || "Chưa cập nhật"}
                  </div>
                </div>

                {/* Ngày sinh */}
                <div>
                  <label className="text-sm font-medium text-slate-500 mb-1 block">
                    Ngày sinh
                  </label>
                  <div className="flex items-center gap-3 text-slate-800 font-medium px-4 py-2.5">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    {formattedDob}
                  </div>
                </div>

                {/* Giới tính */}
                <div>
                  <label className="text-sm font-medium text-slate-500 mb-1 block">
                    Giới tính
                  </label>
                  <div className="flex items-center gap-3 text-slate-800 font-medium px-4 py-2.5">
                    <UserCircle className="w-5 h-5 text-rose-500" />
                    {user.gender === true
                      ? "Nam"
                      : user.gender === false
                        ? "Nữ"
                        : "Chưa cập nhật"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
