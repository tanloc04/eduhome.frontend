import { useState, useEffect } from "react";
import {
  DollarSign,
  Users,
  AlertCircle,
  Wrench,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { dashboardService } from "@/services/dashboard.service";
import type { AdminDashboardStats } from "@/types/dashboard.types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Admin Dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          Tổng quan Hệ thống
        </h2>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-lg font-medium border border-green-100">
          <TrendingUp className="w-4 h-4" /> Hệ thống hoạt động ổn định
        </div>
      </div>

      {/* HÀNG 1: ĐẠI CỤC (Doanh thu & Tổng SV) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Doanh thu */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <DollarSign className="w-24 h-24 text-blue-600" />
          </div>
          <h3 className="text-slate-500 font-semibold text-sm mb-4">
            TỔNG DOANH THU ĐÃ THU
          </h3>
          <p className="text-4xl font-extrabold text-slate-800 relative z-10">
            {stats?.totalRevenue.toLocaleString("vi-VN")}{" "}
            <span className="text-xl text-slate-500 font-medium">VNĐ</span>
          </p>
        </div>

        {/* Tổng Sinh viên */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Users className="w-24 h-24 text-indigo-600" />
          </div>
          <h3 className="text-slate-500 font-semibold text-sm mb-4">
            TỔNG SINH VIÊN ĐANG LƯU TRÚ
          </h3>
          <p className="text-4xl font-extrabold text-slate-800 relative z-10">
            {stats?.totalActiveStudents}{" "}
            <span className="text-xl text-slate-500 font-medium">
              Sinh viên
            </span>
          </p>
        </div>
      </div>

      {/* HÀNG 2: CẢNH BÁO VẬN HÀNH (Nợ đọng & Sự cố) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tình trạng Nợ */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-slate-700 font-bold">Cảnh báo Nợ đọng</h3>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">
                Tổng tiền chưa thu được
              </p>
              <p className="text-2xl font-bold text-red-600">
                {stats?.totalUnpaidAmount.toLocaleString("vi-VN")}{" "}
                <span className="text-sm">VNĐ</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 font-medium mb-1">
                Số lượng hóa đơn
              </p>
              <p className="text-xl font-bold text-slate-700">
                {stats?.unpaidInvoicesCount}{" "}
                <span className="text-sm font-normal">Hóa đơn</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tình trạng Sự cố */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-slate-700 font-bold">Sự cố chờ xử lý</h3>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">
              Số lượng yêu cầu (Tickets) đang Pending
            </p>
            <p className="text-3xl font-bold text-orange-600">
              {stats?.pendingTicketsCount}{" "}
              <span className="text-lg font-medium text-slate-600">
                Yêu cầu
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
