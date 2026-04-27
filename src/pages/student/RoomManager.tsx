import { useState } from "react";
import { DoorOpen, FileText } from "lucide-react";
import StudentRoomInfo from "./RoomInfo";
import StudentBooking from "./Booking";

export default function RoomManagementHub() {
  const [activeTab, setActiveTab] = useState<"current-room" | "booking">(
    "current-room",
  );

  return (
    <div className="animate-in fade-in duration-500">
      {/* THANH MENU TABS CỰC XỊN */}
      <div className="border-b border-slate-200 mb-6 flex gap-6">
        <button
          onClick={() => setActiveTab("current-room")}
          className={`pb-3 flex items-center gap-2 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "current-room"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <DoorOpen className="w-4 h-4" />
          Phòng hiện tại
        </button>

        <button
          onClick={() => setActiveTab("booking")}
          className={`pb-3 flex items-center gap-2 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "booking"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText className="w-4 h-4" />
          Đăng ký lưu trú
        </button>
      </div>

      {/* RENDER NỘI DUNG TƯƠNG ỨNG VỚI TAB */}
      <div className="mt-4">
        {activeTab === "current-room" && <StudentRoomInfo />}
        {activeTab === "booking" && <StudentBooking />}
      </div>
    </div>
  );
}
