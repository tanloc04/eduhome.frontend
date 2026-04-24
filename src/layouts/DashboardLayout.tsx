// src/components/common/StudentLayout.tsx
import { NavLink, Outlet } from "react-router-dom";
import {
  Bell,
  User,
  Users,
  LayoutDashboard,
  UserCircle,
  Wallet,
  DoorOpen,
  Award,
  HelpCircle,
  Building,
  FileText,
  Settings,
  KeySquare,
  BookOpen,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

// Mảng chứa cấu hình các menu trong Sidebar
const studentMenus = [
  { name: "Tổng quan", path: "/student/dashboard", icon: LayoutDashboard },
  { name: "Thông tin cá nhân", path: "/student/profile", icon: UserCircle },
  { name: "Tài chính sinh viên", path: "/student/finance", icon: Wallet },
  { name: "Thông tin phòng", path: "/student/room", icon: DoorOpen },
  { name: "Điểm rèn luyện", path: "/student/points", icon: Award },
  { name: "Hỗ trợ / Liên hệ", path: "/student/support", icon: HelpCircle },
];

const adminMenus = [
  { name: "Tổng quan", path: "/student/dashboard", icon: LayoutDashboard },
  { name: "Quản lý Sinh viên", path: "/admin/students", icon: Users },
  { name: "Quản lý Phòng", path: "/admin/rooms", icon: Building },
  { name: "Hóa đơn & Tài chính", path: "/admin/finance", icon: FileText },
  { name: "Cài đặt hệ thống", path: "/admin/settings", icon: Settings },
];

const menusByRole: Record<string, any[]> = {
  Student: studentMenus,
  Admin: adminMenus,
};

export default function DashboardLayout() {
  const role = useAuthStore((state) => state.role) || "Student";
  const user = useAuthStore((state) => state.user);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  useEffect(() => {
    if (role === "Student") {
      fetchProfile();
    }
  }, [fetchProfile, role]);

  const currentMenus = menusByRole[role] || studentMenus;

  return (
    // Container bao bọc toàn bộ trang (100vh)
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* 1. HEADER */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
        {/* Góc trái: Chuông thông báo */}
        <div className="flex items-center">
          <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
            <Bell className="w-6 h-6 text-slate-600" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
              1
            </span>
          </button>
        </div>

        {/* Ở giữa: Banner/Title */}
        <div className="flex-1 text-center font-bold text-lg text-slate-800 tracking-wide hidden md:block">
          HỆ THỐNG QUẢN LÝ KÝ TÚC XÁ EDUHOME
        </div>

        {/* Góc phải: Thông tin User */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-700">
              {role === "Admin"
                ? "Admin"
                : user
                  ? user.fullName
                  : "Đang tải..."}
            </p>
            {role === "Student" && (
              <p className="text-xs text-slate-500 font-medium">
                MSSV: {user?.studentCode || ""}
              </p>
            )}
          </div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-sm ${
              role === "Admin"
                ? "bg-rose-100 border-rose-200"
                : "bg-blue-100 border-blue-200"
            }`}
          >
            <User
              className={`w-5 h-5 ${
                role === "Admin" ? "text-rose-600" : "text-blue-600"
              }`}
            />
          </div>
        </div>
      </header>

      {/* 2. BODY CONTAINER (Sidebar + Main Content) */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
          <nav className="flex-1 p-4 space-y-1.5">
            {currentMenus.map((menu) => (
              <NavLink
                key={menu.path}
                to={menu.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <menu.icon className="w-5 h-5" />
                {menu.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT (Chứa nội dung các trang con) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Component của các route con (Dashboard, Profile...) sẽ được render tại Outlet này */}
            <Outlet />
          </div>
        </main>
      </div>

      {/* 3. FOOTER */}
      <footer className="bg-white border-t border-slate-200 p-4 text-center">
        <p className="text-sm font-medium text-slate-500">
          © 2026 EduHome. Liên kết:{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Portal Trường
          </a>{" "}
          |{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Website Trường
          </a>
        </p>
      </footer>
    </div>
  );
}
