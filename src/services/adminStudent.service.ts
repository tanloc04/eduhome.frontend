import { apiClient } from "./apiClient";
import type {
  AdminStudentResponseDto,
  UpdateScoreDto,
  AssignRoomDto,
} from "@/types/adminStudent.types";

export const adminStudentService = {
  getAll: async (): Promise<AdminStudentResponseDto[]> => {
    const response =
      await apiClient.get<AdminStudentResponseDto[]>("/AdminStudents");
    return response.data;
  },

  toggleStatus: async (
    id: number,
  ): Promise<{ message: string; isActive: boolean }> => {
    const response = await apiClient.put(`/AdminStudents/${id}/toggle-status`);
    return response.data;
  },

  updateScore: async (
    id: number,
    payload: UpdateScoreDto,
  ): Promise<{ message: string; priorityScore: number }> => {
    const response = await apiClient.put(
      `/AdminStudents/${id}/update-score`,
      payload,
    );
    return response.data;
  },

  assignRoom: async (
    id: number,
    payload: AssignRoomDto,
  ): Promise<{ message: string }> => {
    const response = await apiClient.post(
      `/AdminStudents/${id}/assign-room`,
      payload,
    );
    return response.data;
  },
};
