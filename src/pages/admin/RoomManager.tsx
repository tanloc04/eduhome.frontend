import { useState } from "react";
import { Plus, Edit, Trash2, X, Loader2, DoorOpen } from "lucide-react";
import type { Room, RoomPayload } from "@/types/room.types";
import {
  useRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
} from "@/hooks/useRooms";
import { useBuildings } from "@/hooks/useBuildings";
import { useRoomTypes } from "@/hooks/useRoomTypes";

export default function RoomManager() {
  const { data: rooms = [], isLoading: isRoomsLoading } = useRooms();
  const { data: buildings = [], isLoading: isBuildingsLoading } =
    useBuildings();
  const { data: roomTypes = [], isLoading: isRoomTypesLoading } =
    useRoomTypes();

  const createMutation = useCreateRoom();
  const updateMutation = useUpdateRoom();
  const deleteMutation = useDeleteRoom();

  const isLoading = isRoomsLoading || isBuildingsLoading || isRoomTypesLoading;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<RoomPayload>({
    name: "",
    buildingId: 0,
    roomTypeId: 0,
    status: 0,
  });

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingId(room.id);
      setFormData({
        name: room.name,
        buildingId: room.buildingId,
        roomTypeId: room.roomTypeId,
        status: room.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        buildingId: buildings.length > 0 ? buildings[0].id : 0,
        roomTypeId: roomTypes.length > 0 ? roomTypes[0].id : 0,
        status: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", buildingId: 0, roomTypeId: 0, status: 0 });
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
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getBuildingName = (id: number) =>
    buildings.find((b) => b.id === id)?.name || "N/A";
  const getRoomTypeName = (id: number) =>
    roomTypes.find((rt) => rt.id === id)?.name || "N/A";

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">
            Trống
          </span>
        );
      case 1:
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">
            Đang thuê
          </span>
        );
      case 2:
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-bold">
            Bảo trì
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <DoorOpen className="w-6 h-6 text-indigo-600" />
          Quản lý Phòng
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" /> Thêm Phòng mới
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="p-4 font-semibold">Tên Phòng</th>
                <th className="p-4 font-semibold">Tòa nhà</th>
                <th className="p-4 font-semibold">Loại Phòng</th>
                <th className="p-4 font-semibold">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Chưa có dữ liệu phòng
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr
                    key={room.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 text-slate-800 font-bold">
                      {room.name}
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      {getBuildingName(room.buildingId)}
                    </td>
                    <td className="p-4 text-slate-600">
                      {getRoomTypeName(room.roomTypeId)}
                    </td>
                    <td className="p-4">{getStatusBadge(room.status)}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(room)}
                        className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors inline-flex"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
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
                {editingId ? "Cập nhật Phòng" : "Thêm Phòng mới"}
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
                  Tên Phòng
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="VD: 101"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tòa nhà
                  </label>
                  <select
                    value={formData.buildingId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        buildingId: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Loại Phòng
                  </label>
                  <select
                    value={formData.roomTypeId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        roomTypeId: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {roomTypes.map((rt) => (
                      <option key={rt.id} value={rt.id}>
                        {rt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={0}>Trống</option>
                  <option value={1}>Đang thuê</option>
                  <option value={2}>Bảo trì</option>
                </select>
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
                  className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
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
