import { useState } from "react";
import { useRoomTypes } from "@/hooks/useRoomTypes";
import { useMyBookings, useCreateBooking } from "@/hooks/useBookings";
import {
  Building,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function StudentBooking() {
  // States cho form
  const [roomTypeId, setRoomTypeId] = useState<number | "">("");
  const [semester, setSemester] = useState<string>("HK1-2026"); // Set mặc định học kỳ hiện tại

  // Gọi APIs
  const { data: roomTypes, isLoading: isTypesLoading } = useRoomTypes();
  const { data: myBookings, isLoading: isBookingsLoading } = useMyBookings();
  const { mutateAsync: createBooking, isPending } = useCreateBooking();

  // Hàm submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomTypeId || !semester.trim()) {
      toast("Vui lòng chọn loại phòng và nhập học kỳ!");
      return;
    }

    try {
      await createBooking({
        roomTypeId: Number(roomTypeId),
        semester,
      });
      toast.success(
        "Gửi yêu cầu đăng ký phòng thành công! Vui lòng chờ duyệt.",
      );
      setRoomTypeId(""); // Reset form sau khi gửi
    } catch (error: any) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra khi đăng ký!";
      toast.error(msg);
    }
  };

  // Hàm render UI trạng thái Booking (0: Chờ duyệt, 1: Đã duyệt, 2: Từ chối)
  const renderStatus = (status: number) => {
    switch (status) {
      case 0:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
            <Clock className="w-3 h-3" /> Đang chờ duyệt
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Đã duyệt
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
            <XCircle className="w-3 h-3" /> Bị từ chối
          </span>
        );
      default:
        return <span className="text-slate-500">Không xác định</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-7 h-7 text-indigo-600" />
        <h2 className="text-2xl font-bold text-slate-800">Đăng ký lưu trú</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* NỬA TRÁI: FORM ĐĂNG KÝ (Chiếm 3 cột) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
          <div className="bg-slate-50 border-b border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 text-lg">
              Tạo đơn đăng ký mới
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Chọn loại phòng bạn muốn ở trong học kỳ tới. Ban quản lý sẽ ưu
              tiên xếp phòng theo thứ tự thời gian nộp đơn.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Học kỳ đăng ký <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="VD: HK1-2026"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Loại phòng mong muốn <span className="text-rose-500">*</span>
              </label>
              <select
                value={roomTypeId}
                onChange={(e) => setRoomTypeId(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                disabled={isTypesLoading}
              >
                <option value="">-- Chọn loại phòng --</option>
                {roomTypes?.map((type: any) => (
                  <option key={type.id} value={type.id}>
                    {type.name} (Chứa {type.capacity} SV) -{" "}
                    {type.basePrice?.toLocaleString("vi-VN")} đ/tháng
                  </option>
                ))}
              </select>
              {isTypesLoading && (
                <p className="text-xs text-indigo-500 mt-2 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Đang tải danh
                  sách loại phòng...
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isPending ? "Đang gửi đơn..." : "Gửi Đơn Đăng Ký"}
              </button>
            </div>
          </form>
        </div>

        {/* NỬA PHẢI: LỊCH SỬ ĐĂNG KÝ (Chiếm 2 cột) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit">
          <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Lịch sử đăng ký của bạn
          </h3>

          {isBookingsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : !myBookings || myBookings.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">
                Bạn chưa có đơn đăng ký nào
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-800 text-sm">
                      {booking.semester}
                    </span>
                    {renderStatus(booking.status)}
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-slate-600 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {booking.roomType}
                    </p>

                    {/* Nếu bị từ chối và có note từ Admin, hiển thị ra */}
                    {booking.status === 2 && booking.note && (
                      <div className="mt-2 text-xs bg-rose-100 text-rose-700 p-2 rounded-lg border border-rose-200">
                        <strong>Lý do:</strong> {booking.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
