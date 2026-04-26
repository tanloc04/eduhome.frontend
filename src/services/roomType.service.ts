import { apiClient } from "./apiClient";
import type { RoomType, RoomTypePayload } from "@/types/roomType.types";

export const roomTypeService = {
  getAll: async (): Promise<RoomType[]> => {
    const response = await apiClient.get<RoomType[]>("/RoomTypes");
    return response.data;
  },

  getById: async (id: number): Promise<RoomType> => {
    const response = await apiClient.get<RoomType>(`/RoomTypes/${id}`);
    return response.data;
  },

  create: async (payload: RoomTypePayload): Promise<RoomType> => {
    const response = await apiClient.post<RoomType>("/RoomTypes", payload);
    return response.data;
  },

  update: async (id: number, payload: RoomTypePayload): Promise<RoomType> => {
    const response = await apiClient.put<RoomType>(`/RoomTypes/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/RoomTypes/${id}`);
  },
};
