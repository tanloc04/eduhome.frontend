import { useState, useMemo } from "react";
import {
  Users,
  Home,
  Star,
  Shield,
  ShieldAlert,
  Loader2,
  X,
  LogOut,
} from "lucide-react";
import {
  useAdminStudents,
  useToggleStudentStatus,
  useUpdateStudentScore,
  useAssignStudentRoom,
} from "@/hooks/useAdminStudents";
import { useBuildings } from "@/hooks/useBuildings";
import { useRooms } from "@/hooks/useRooms";
import type { AdminStudentResponseDto } from "@/types/adminStudent.types";

export default function StudentManager() {
  const { data: students = [], isLoading: isStudentsLoading } =
    useAdminStudents();
  const { data: buildings = [], isLoading: isBuildingsLoading } =
    useBuildings();
  const { data: rooms = [], isLoading: isRoomsLoading } = useRooms();

  const toggleMutation = useToggleStudentStatus();
  const scoreMutation = useUpdateStudentScore();
  const assignRoomMutation = useAssignStudentRoom();

  const isLoading = isStudentsLoading || isBuildingsLoading || isRoomsLoading;

  const [selectedStudent, setSelectedStudent] =
    useState<AdminStudentResponseDto | null>(null);

  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [scoreForm, setScoreForm] = useState({ points: 100 });

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomForm, setRoomForm] = useState({ buildingId: 0, roomId: 0 });

  const handleToggleStatus = async (student: AdminStudentResponseDto) => {
    const action = student.isActive ? "khóa" : "mở khóa";
    if (
      window.confirm(
        `Bạn có chắc chắn muốn ${action} tài khoản của sinh viên ${student.fullName}?`,
      )
    ) {
      try {
        await toggleMutation.mutateAsync(student.id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const openScoreModal = (student: AdminStudentResponseDto) => {
    setSelectedStudent(student);
    setScoreForm({ points: student.priorityScore });
    setIsScoreModalOpen(true);
  };

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      await scoreMutation.mutateAsync({
        id: selectedStudent.id,
        payload: scoreForm,
      });
      setIsScoreModalOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error(error);
    }
  };

  const openRoomModal = (student: AdminStudentResponseDto) => {
    setSelectedStudent(student);
    let defaultBuildingId = buildings.length > 0 ? buildings[0].id : 0;

    if (student.roomId) {
      const currentRoom = rooms.find((r) => r.id === student.roomId);
      if (currentRoom) {
        defaultBuildingId = currentRoom.buildingId;
      }
    }

    setRoomForm({
      buildingId: defaultBuildingId,
      roomId: student.roomId || 0,
    });
    setIsRoomModalOpen(true);
  };

  const availableRooms = useMemo(() => {
    return rooms.filter((r) => r.buildingId === roomForm.buildingId);
  }, [rooms, roomForm.buildingId]);

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      await assignRoomMutation.mutateAsync({
        id: selectedStudent.id,
        payload: { roomId: roomForm.roomId === 0 ? null : roomForm.roomId },
      });
      setIsRoomModalOpen(false);
      setSelectedStudent(null);
    } catch (error: any) {
      alert(error.response?.data?.Error || "Có lỗi xảy ra khi xếp phòng");
    }
  };

  const handleCheckout = async () => {
    if (!selectedStudent) return;
    if (
      window.confirm(
        `Bạn có chắc chắn muốn làm thủ tục trả phòng cho sinh viên ${selectedStudent.fullName}?`,
      )
    ) {
      try {
        await assignRoomMutation.mutateAsync({
          id: selectedStudent.id,
          payload: { roomId: null },
        });
        setIsRoomModalOpen(false);
        setSelectedStudent(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80)
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">
          {score} đ
        </span>
      );
    if (score >= 50)
      return (
        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-bold">
          {score} đ
        </span>
      );
    return (
      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">
        {score} đ
      </span>
    );
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          Quản lý Sinh viên
        </h2>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                  <th className="p-4 font-semibold">Sinh viên</th>
                  <th className="p-4 font-semibold">Chuyên ngành</th>
                  <th className="p-4 font-semibold">Lưu trú</th>
                  <th className="p-4 font-semibold text-center">Điểm RL</th>
                  <th className="p-4 font-semibold text-center">Trạng thái</th>
                  <th className="p-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Chưa có dữ liệu sinh viên
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-bold text-slate-800">
                          {student.fullName}
                        </div>
                        <div className="text-sm text-slate-500">
                          {student.studentCode}
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{student.major}</td>
                      <td className="p-4">
                        {student.roomName ? (
                          <div>
                            <span className="font-semibold text-indigo-700">
                              {student.roomName}
                            </span>
                            <span className="text-sm text-slate-500 ml-1">
                              ({student.buildingName})
                            </span>
                          </div>
                        ) : (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                            Chưa xếp phòng
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {getScoreBadge(student.priorityScore)}
                      </td>
                      <td className="p-4 text-center">
                        {student.isActive ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">
                            Đã khóa
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => openRoomModal(student)}
                          title="Xếp phòng"
                          className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors inline-flex"
                        >
                          <Home className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openScoreModal(student)}
                          title="Cập nhật điểm"
                          className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors inline-flex"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(student)}
                          title={
                            student.isActive
                              ? "Khóa tài khoản"
                              : "Mở khóa tài khoản"
                          }
                          className={`p-2 rounded-lg transition-colors inline-flex ${
                            student.isActive
                              ? "text-red-600 hover:bg-red-100"
                              : "text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {student.isActive ? (
                            <ShieldAlert className="w-4 h-4" />
                          ) : (
                            <Shield className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isScoreModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                Cập nhật điểm rèn luyện
              </h3>
              <button
                onClick={() => setIsScoreModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleScoreSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sinh viên:{" "}
                  <span className="font-bold">{selectedStudent.fullName}</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={100}
                  value={scoreForm.points}
                  onChange={(e) =>
                    setScoreForm({ points: parseInt(e.target.value) || 0 })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsScoreModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                  disabled={scoreMutation.isPending}
                >
                  {scoreMutation.isPending ? "Đang lưu..." : "Lưu điểm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isRoomModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                Quản lý lưu trú
              </h3>
              <button
                onClick={() => setIsRoomModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRoomSubmit} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 mb-4">
                Đang thao tác cho SV:{" "}
                <span className="font-bold">{selectedStudent.fullName}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tòa nhà
                  </label>
                  <select
                    value={roomForm.buildingId}
                    onChange={(e) => {
                      const newBuildingId = parseInt(e.target.value);
                      const newRooms = rooms.filter(
                        (r) => r.buildingId === newBuildingId,
                      );
                      setRoomForm({
                        buildingId: newBuildingId,
                        roomId: newRooms.length > 0 ? newRooms[0].id : 0,
                      });
                    }}
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
                    Phòng
                  </label>
                  <select
                    value={roomForm.roomId}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        roomId: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={0} disabled>
                      -- Chọn phòng --
                    </option>
                    {availableRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-6 flex justify-between items-center">
                {selectedStudent.roomId ? (
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 font-medium transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" /> Trả phòng
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRoomModalOpen(false)}
                    className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                    disabled={
                      assignRoomMutation.isPending || roomForm.roomId === 0
                    }
                  >
                    {assignRoomMutation.isPending
                      ? "Đang xử lý..."
                      : "Lưu thay đổi"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
