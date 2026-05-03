import { useState } from "react";
import {
  useAllBookings,
  useApproveBooking,
  useRejectBooking,
} from "@/hooks/useAdminBookings"; // Đường dẫn tới file hook Admin nãy bạn tạo
import { useRooms } from "@/hooks/useRooms"; // Hook lấy danh sách phòng của bạn
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminBookingManagement() {
  // Gọi API lấy dữ liệu
  const { data: bookings, isLoading: isBookingsLoading } = useAllBookings();
  const { data: rooms } = useRooms(); // Lấy danh sách phòng để lát Admin chọn

  const { mutateAsync: approveBooking, isPending: isApproving } =
    useApproveBooking();
  const { mutateAsync: rejectBooking, isPending: isRejecting } =
    useRejectBooking();

  // State cho Modal Duyệt
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedBookingForApprove, setSelectedBookingForApprove] =
    useState<any>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | "">("");

  // State cho Modal Từ chối
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedBookingForReject, setSelectedBookingForReject] =
    useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  // --- CÁC HÀM XỬ LÝ DUYỆT ---
  const handleOpenApprove = (booking: any) => {
    setSelectedBookingForApprove(booking);
    setSelectedRoomId(""); // Reset lại ô chọn phòng
    setIsApproveModalOpen(true);
  };

  const submitApprove = async () => {
    if (!selectedRoomId) {
      toast("Vui lòng chọn một phòng để xếp cho sinh viên!");
      return;
    }
    try {
      await approveBooking({
        id: selectedBookingForApprove.id,
        roomId: Number(selectedRoomId),
      });
      toast.success("Duyệt đơn và xếp phòng thành công!");
      setIsApproveModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi duyệt đơn!");
    }
  };

  // --- CÁC HÀM XỬ LÝ TỪ CHỐI ---
  const handleOpenReject = (booking: any) => {
    setSelectedBookingForReject(booking);
    setRejectReason(""); // Reset lại lý do
    setIsRejectModalOpen(true);
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) {
      toast("Vui lòng nhập lý do từ chối!");
      return;
    }
    try {
      await rejectBooking({
        id: selectedBookingForReject.id,
        reason: rejectReason,
      });
      toast.success("Đã từ chối đơn đăng ký!");
      setIsRejectModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi từ chối đơn!");
    }
  };

  // Hàm render Badge trạng thái
  const renderStatus = (status: number) => {
    switch (status) {
      case 0:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
            <Clock className="w-3 h-3" /> Chờ duyệt
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
            <XCircle className="w-3 h-3" /> Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">
          Xét duyệt Đăng ký Lưu trú
        </h2>
      </div>

      {/* BẢNG DANH SÁCH ĐƠN */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isBookingsLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Sinh viên</th>
                  <th className="px-6 py-4">Học kỳ</th>
                  <th className="px-6 py-4">Loại phòng yêu cầu</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Không có đơn đăng ký nào.
                    </td>
                  </tr>
                ) : (
                  // Ưu tiên đưa các đơn đang Pending (0) lên đầu
                  bookings
                    ?.sort((a: any, b: any) => a.status - b.status)
                    .map((booking: any) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">
                            {booking.studentName}
                          </div>
                          <div className="text-xs text-slate-400">
                            {booking.studentCode}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {booking.semester}
                        </td>
                        <td className="px-6 py-4">{booking.roomType}</td>
                        <td className="px-6 py-4">
                          {renderStatus(booking.status)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {booking.status === 0 ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenApprove(booking)}
                                className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 font-semibold rounded-lg transition-colors border border-emerald-200"
                              >
                                Duyệt
                              </button>
                              <button
                                onClick={() => handleOpenReject(booking)}
                                className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-semibold rounded-lg transition-colors border border-rose-200"
                              >
                                Từ chối
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs italic">
                              Đã xử lý
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL DUYỆT ĐƠN VÀ XẾP PHÒNG */}
      {/* ------------------------------------------------------------- */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-50 border-b border-emerald-100 p-6 flex items-start gap-4">
              <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-800">
                  Duyệt đơn & Xếp phòng
                </h3>
                <p className="text-sm text-emerald-600 mt-1">
                  Đang xử lý đơn của SV:{" "}
                  <span className="font-bold">
                    {selectedBookingForApprove?.studentName}
                  </span>
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm space-y-2 text-slate-600">
                <p>
                  <strong>Loại phòng yêu cầu:</strong>{" "}
                  {selectedBookingForApprove?.roomType}
                </p>
                <p>
                  <strong>Học kỳ:</strong> {selectedBookingForApprove?.semester}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Chọn phòng để xếp sinh viên vào{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="">-- Chọn một phòng --</option>
                  {/* Chỗ này lọc ra các phòng có trạng thái trống (0). Tùy logic DB của bạn nhé */}
                  {rooms
                    ?.filter((r: any) => r.status === 0)
                    .map((room: any) => (
                      <option key={room.id} value={room.id}>
                        Phòng {room.name} (Tòa {room.buildingName})
                      </option>
                    ))}
                </select>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Chỉ hiển thị các phòng
                  đang còn giường trống.
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setIsApproveModalOpen(false)}
                disabled={isApproving}
                className="px-5 py-2 text-slate-600 font-semibold hover:bg-slate-200 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={submitApprove}
                disabled={isApproving}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isApproving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                Xác nhận Duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL TỪ CHỐI ĐƠN */}
      {/* ------------------------------------------------------------- */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-rose-50 border-b border-rose-100 p-6 flex items-start gap-4">
              <div className="p-2 bg-rose-100 rounded-full text-rose-600">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-rose-800">
                  Từ chối đơn đăng ký
                </h3>
                <p className="text-sm text-rose-600 mt-1">
                  Bạn đang từ chối đơn của SV:{" "}
                  <span className="font-bold">
                    {selectedBookingForReject?.studentName}
                  </span>
                </p>
              </div>
            </div>

            <div className="p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Lý do từ chối (Gửi cho sinh viên){" "}
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="VD: Đã hết phòng loại này, sinh viên vui lòng chọn loại phòng khác..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none"
              />
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                disabled={isRejecting}
                className="px-5 py-2 text-slate-600 font-semibold hover:bg-slate-200 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={submitReject}
                disabled={isRejecting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isRejecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                Xác nhận Từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
