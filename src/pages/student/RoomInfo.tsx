import {
  DoorOpen,
  Users,
  BedSingle,
  Wallet,
  Building,
  Info,
  CheckCircle2,
  Settings,
  Loader2,
} from "lucide-react";

import { useMyRoom } from "@/hooks/useRooms";

export default function StudentRoomInfo() {
  const { data: room, isLoading, isError } = useMyRoom();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto mt-10">
        <DoorOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-800">
          Chưa có thông tin phòng
        </h3>
        <p className="text-slate-500 mt-2">
          Hiện tại bạn chưa được xếp phòng hoặc hợp đồng lưu trú chưa có hiệu
          lực. Vui lòng liên hệ Ban quản lý nếu cần hỗ trợ.
        </p>
      </div>
    );
  }

  // Render trạng thái phòng dựa theo Enum trong ERD (0-Trống, 1-Đã đầy, 2-Bảo trì)
  const getRoomStatus = (status: number) => {
    // THÊM LOGIC ĐỘ CHẾ Ở ĐÂY:
    // Đếm số người thực tế đang ở
    const currentOccupants = room.roommates?.length || 0;

    // Nếu DB báo là Trống (0) NHƯNG thực tế đã đủ người -> Ép trạng thái hiển thị thành Đầy (1)
    const finalStatus =
      status === 0 && currentOccupants >= (room.capacity || 0) ? 1 : status;

    switch (finalStatus) {
      case 0:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Còn giường trống
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-semibold border border-orange-200">
            <Users className="w-4 h-4" /> Đã đầy
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-sm font-semibold border border-rose-200">
            <Settings className="w-4 h-4" /> Đang bảo trì
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-6">
        <DoorOpen className="w-7 h-7 text-indigo-600" />
        <h2 className="text-2xl font-bold text-slate-800">
          Thông tin phòng lưu trú
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* THẺ THÔNG TIN CHÍNH CỦA PHÒNG */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white flex justify-between items-start">
            <div>
              <p className="text-indigo-100 font-medium mb-1 flex items-center gap-2">
                <Building className="w-4 h-4" /> Tòa nhà{" "}
                {room.buildingName || "A1"} - Tầng {room.floor}
              </p>
              <h3 className="text-4xl font-bold tracking-tight">
                Phòng {room.name}
              </h3>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <DoorOpen className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              Chi tiết cơ sở vật chất
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Loại phòng</p>
                  <p className="font-bold text-slate-800">
                    {room.roomTypeName || "Phòng Tiêu Chuẩn"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600">
                  <BedSingle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Sức chứa tối đa</p>
                  <p className="font-bold text-slate-800">
                    {room.capacity} Sinh viên
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Trạng thái hiện tại</p>
                  <div className="mt-0.5">{getRoomStatus(room.status)}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="bg-emerald-100 p-2.5 rounded-lg text-emerald-600">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">
                    Đơn giá phòng / tháng
                  </p>
                  <p className="font-bold text-emerald-600">
                    {room.basePrice
                      ? room.basePrice.toLocaleString("vi-VN")
                      : "0"}{" "}
                    đ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* THẺ THÀNH VIÊN TRONG PHÒNG (Optional: Cần API trả về list sinh viên trong phòng) */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
            <Users className="w-5 h-5 text-indigo-600" />
            Thành viên cùng phòng
          </h4>

          {/* Mockup list thành viên - Bạn map dữ liệu thật vào đây nếu API có trả về danh sách bạn cùng phòng */}
          {/* Vòng lặp hiển thị sinh viên có thật trong phòng */}
          <div className="space-y-4">
            {room.roommates?.map((rm, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${rm.isMe ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}
                >
                  {rm.isMe ? "ME" : "SV"}
                </div>
                <div>
                  <p
                    className={`text-sm ${rm.isMe ? "font-bold text-slate-800" : "font-medium text-slate-700"}`}
                  >
                    {rm.fullName} {rm.isMe && "(Bạn)"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {rm.studentCode} • Giường {idx + 1}
                  </p>
                </div>
              </div>
            ))}

            {/* Lấp đầy các slot còn trống dựa trên Capacity trừ đi số người đang ở */}
            {Array.from({
              length: Math.max(
                0,
                (room.capacity || 4) - (room.roommates?.length || 0),
              ),
            }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="flex items-center gap-3 opacity-50"
              >
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <BedSingle className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 italic">
                    Giường trống
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
