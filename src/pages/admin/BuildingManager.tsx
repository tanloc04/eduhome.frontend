import { useState } from "react";
import { Plus, Edit, Trash2, Building2, X, Loader2 } from "lucide-react";
import type { Building, BuildingPayload } from "@/types/building.types";
import {
  useBuildings,
  useCreateBuilding,
  useUpdateBuilding,
  useDeleteBuilding,
} from "@/hooks/useBuildings";

export default function BuildingManager() {
  const { data: buildings = [], isLoading } = useBuildings();
  const createMutation = useCreateBuilding();
  const updateMutation = useUpdateBuilding();
  const deleteMutation = useDeleteBuilding();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<BuildingPayload>({
    name: "",
    totalFloors: 0,
  });

  const handleOpenModal = (building?: Building) => {
    if (building) {
      setEditingId(building.id);
      setFormData({ name: building.name, totalFloors: building.totalFloors });
    } else {
      setEditingId(null);
      setFormData({ name: "", totalFloors: 0 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", totalFloors: 0 });
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
    if (window.confirm("Bạn có chắc chắn muốn xóa tòa nhà này?")) {
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
          <Building2 className="w-6 h-6 text-blue-600" />
          Quản lý Tòa nhà
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" /> Thêm Tòa nhà
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Tên Tòa nhà</th>
                <th className="p-4 font-semibold">Tổng số tầng</th>
                <th className="p-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {buildings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Chưa có dữ liệu tòa nhà
                  </td>
                </tr>
              ) : (
                buildings.map((building) => (
                  <tr
                    key={building.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 text-slate-600 font-medium">
                      {building.id}
                    </td>
                    <td className="p-4 text-slate-800 font-bold">
                      {building.name}
                    </td>
                    <td className="p-4 text-slate-600">
                      {building.totalFloors}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(building)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors inline-flex"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(building.id)}
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
                {editingId ? "Cập nhật Tòa nhà" : "Thêm Tòa nhà mới"}
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
                  Tên Tòa nhà
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Tòa A1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tổng số tầng
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.totalFloors || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalFloors: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: 5"
                />
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
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition-colors"
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
