import { useState } from "react";
import { Users, ClipboardCheck } from "lucide-react";
import StudentManager from "./StudentManager";
import AdminBookingManagement from "./AdminBookingManagement";

export default function StudentManagementTabs() {
  const [activeTab, setActiveTab] = useState<"students" | "bookings">(
    "students",
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("students")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === "students"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <Users className="w-5 h-5" />
            Danh sách Sinh viên
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === "bookings"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <ClipboardCheck className="w-5 h-5" />
            Xét duyệt Đăng ký
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "students" && <StudentManager />}
        {activeTab === "bookings" && <AdminBookingManagement />}
      </div>
    </div>
  );
}
