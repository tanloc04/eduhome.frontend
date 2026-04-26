import { useState } from "react";
import { Plus, Edit, Trash2, X, Loader2, Tags } from "lucide-react";
import type { RoomType, RoomTypePayload } from "@/types/roomType.types";
import {
  useRoomTypes,
  useCreateRoomType,
  useUpdateRoomType,
  useDeleteRoomType,
} from "@/hooks/useRoomTypes";

export default function RoomTypeManager() {
  const { data: roomTypes = [], isLoading } = useRoomTypes();
  const createMutation = useCreateRoomType();
  const updateMutation = useUpdateRoomType();
  const deleteMutation = useDeleteRoomType();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<RoomTypePayload>({
    name: "",
    capacity: 0,
    basePrice: 0,
  });

  const handleOpenModal = (roomType?: RoomType) => {
    if (roomType) {
      setEditingId(roomType.id);
      setFormData({
        name: roomType.name,
        capacity: roomType.capacity,
        basePrice: roomType.basePrice,
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", capacity: 0, basePrice: 0 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", capacity: 0, basePrice: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, payload: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa loại phòng này?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Tags className="w-6 h-6 text-emerald-600" />
          Quản lý Loại Phòng
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" /> Thêm Loại Phòng
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Tên Loại Phòng</th>
                <th className="p-4 font-semibold">Sức chứa (Người)</th>
                <th className="p-4 font-semibold">Giá cơ bản (VNĐ)</th>
                <th className="p-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Chưa có dữ liệu loại phòng
                  </td>
                </tr>
              ) : (
                roomTypes.map((rt) => (
                  <tr
                    key={rt.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 text-slate-600 font-medium">{rt.id}</td>
                    <td className="p-4 text-slate-800 font-bold">{rt.name}</td>
                    <td className="p-4 text-slate-600">{rt.capacity}</td>
                    <td className="p-4 text-emerald-600 font-bold">
                      {rt.basePrice.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(rt)}
                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors inline-flex"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(rt.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors inline-flex"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? "Cập nhật Loại Phòng" : "Thêm Loại Phòng mới"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên Loại Phòng
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="VD: Phòng 4 người (Quạt)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Sức chứa
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacity || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="VD: 4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Giá tiền (VNĐ)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={formData.basePrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basePrice: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="VD: 800000"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 font-medium transition-colors"
                >
                  {editingId ? "Lưu thay đổi" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
