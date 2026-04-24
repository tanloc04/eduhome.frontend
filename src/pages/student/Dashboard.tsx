import { useState, useEffect } from "react";
import {
  Bell,
  CreditCard,
  Award,
  CalendarClock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { dashboardService } from "@/services/dashboard.service";
import type { StudentDashboardStats } from "@/types/dashboard.types";

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStudentStats();
        setStats(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Hàm chuyển đổi ngày tháng cho đẹp (từ YYYY-MM-DD sang DD/MM/YYYY)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      {/* 1. Khu vực Thông báo quan trọng (Tạm thời giữ nguyên Mock Data) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Thông báo quan trọng
          </h2>
          <button className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-1">
              <p className="font-bold text-slate-800 text-base">
                Thông báo thu tiền phòng Ký túc xá Tháng 5/2026
              </p>
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                Mới
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Hạn chót đóng tiền là ngày 15/05/2026. Sinh viên vui lòng hoàn
              thành nghĩa vụ tài chính đúng hạn để không bị trừ điểm rèn
              luyện...
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Đăng lúc: 08:30 - 23/04/2026
            </p>
          </div>
        </div>
      </div>

      {/* 2. Các Widget Chỉ số sinh tồn */}
      {isLoading ? (
        // Hiệu ứng Loading xoay xoay cực xịn trong lúc đợi data
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Số dư nợ */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-500 font-semibold text-sm">
                SỐ DƯ NỢ HIỆN TẠI
              </h3>
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-slate-800">
                {stats?.currentDebt.toLocaleString("vi-VN")}
                <span className="text-lg text-slate-500 font-medium ml-1">
                  VNĐ
                </span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                {/* Logic: Nếu nợ > 0 thì báo đỏ chớp nháy, nếu = 0 thì báo xanh êm ái */}
                <span
                  className={`flex w-2 h-2 rounded-full ${stats?.currentDebt && stats.currentDebt > 0 ? "bg-red-500 animate-pulse" : "bg-green-500"}`}
                ></span>
                <p
                  className={`text-sm font-medium ${stats?.currentDebt && stats.currentDebt > 0 ? "text-red-500" : "text-green-600"}`}
                >
                  {stats?.currentDebt && stats.currentDebt > 0
                    ? `Cần thanh toán trước ${formatDate(stats?.debtDueDate)}`
                    : "Đã hoàn thành nghĩa vụ"}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Điểm rèn luyện */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-500 font-semibold text-sm">
                ĐIỂM RÈN LUYỆN
              </h3>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-slate-800">
                {stats?.trainingPoints}
                <span className="text-lg text-slate-500 font-medium ml-1">
                  / 100
                </span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex w-2 h-2 rounded-full bg-green-500"></span>
                <p className="text-sm text-green-600 font-medium">
                  Xếp loại: {stats?.pointClassification}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Kỳ đóng tiền tiếp theo */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1 group cursor-pointer">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-500 font-semibold text-sm">
                KỲ TIẾP THEO
              </h3>
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarClock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <p
                className="text-xl font-extrabold text-slate-800 truncate"
                title={stats?.nextSemesterName}
              >
                {stats?.nextSemesterName}
              </p>
              <p className="text-xs text-orange-600 font-semibold bg-orange-50 inline-block px-2 py-1 rounded mt-2">
                Dự kiến mở: {formatDate(stats?.nextSemesterOpenDate)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
