import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  SearchAlert,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";

const studentMenus = [
  { name: "Tổng quan", path: "/student/dashboard", icon: LayoutDashboard },
  { name: "Thông tin cá nhân", path: "/student/profile", icon: UserCircle },
  { name: "Tài chính sinh viên", path: "/student/finance", icon: Wallet },
  { name: "Thông tin phòng", path: "/student/room", icon: DoorOpen },
  { name: "Điểm rèn luyện", path: "/student/points", icon: Award },
  { name: "Hỗ trợ / Liên hệ", path: "/student/support", icon: HelpCircle },
];

const adminMenus = [
  { name: "Tổng quan", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Quản lý Sinh viên", path: "/admin/students", icon: Users },
  { name: "Quản lý Phòng", path: "/admin/rooms", icon: Building },
  { name: "Hóa đơn & Tài chính", path: "/admin/finance", icon: FileText },
  { name: "Yêu cầu sửa chữa", path: "/admin/issues", icon: SearchAlert },
  { name: "Cài đặt hệ thống", path: "/admin/settings", icon: Settings },
];

const menusByRole: Record<string, any[]> = {
  Student: studentMenus,
  Admin: adminMenus,
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role) || "Student";
  const user = useAuthStore((state) => state.user);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const logout = useAuthStore((state) => state.logout);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (role === "Student") {
      fetchProfile();
    }
  }, [fetchProfile, role]);

  const currentMenus = menusByRole[role] || studentMenus;

  return (
    // ROOT CONTAINER: Flex Row (Trái -> Phải) chiều cao 100vh
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* 1. SIDEBAR: Nằm góc trái, full chiều cao */}
      <aside className="w-64 bg-slate-900 flex flex-col flex-shrink-0 shadow-xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-black text-white tracking-wider">
            EDU<span className="text-indigo-500">HOME</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto mt-2">
          {currentMenus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-50"
                }`
              }
            >
              <menu.icon className="w-5 h-5" />
              {menu.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* 2. CỤM BÊN PHẢI: Chứa Header + Main Content + Footer */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10 shadow-sm shrink-0">
          <div className="flex items-center">
            <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="w-6 h-6 text-slate-600" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                1
              </span>
            </button>
          </div>

          <div className="flex-1 text-center font-bold text-lg text-slate-800 tracking-wide hidden md:block">
            HỆ THỐNG QUẢN LÝ KÝ TÚC XÁ EDUHOME
          </div>

          {/* Góc phải: Thông tin User & Dropdown */}
          <div className="relative">
            {/* NÚT BẤM ĐỂ MỞ MENU */}
            <div
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
            >
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
                className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-sm transition-transform ${
                  isProfileOpen ? "scale-95 ring-2 ring-indigo-200" : ""
                } ${
                  role === "Admin"
                    ? "bg-rose-100 border-rose-200"
                    : "bg-indigo-100 border-indigo-200"
                }`}
              >
                <User
                  className={`w-5 h-5 ${
                    role === "Admin" ? "text-rose-600" : "text-indigo-600"
                  }`}
                />
              </div>
            </div>

            {/* MENU DROPDOWN XỔ XUỐNG */}
            {isProfileOpen && (
              <>
                {/* Lớp overlay vô hình bắt sự kiện click ra ngoài để đóng menu */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                ></div>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {/* Dành cho màn hình nhỏ bị ẩn chữ */}
                  <div className="px-4 py-2 border-b border-slate-100 mb-1 sm:hidden">
                    <p className="text-sm font-bold text-slate-800">
                      {user?.fullName || "Admin"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user?.studentCode || "Quản trị viên"}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t border-slate-200 p-4 text-center shrink-0">
          <p className="text-sm font-medium text-slate-500">
            © 2026 EduHome. Liên kết:{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Portal Trường
            </a>{" "}
            |{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Website Trường
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
