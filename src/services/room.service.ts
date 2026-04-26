import { apiClient } from "./apiClient";
import type { Room, RoomDetailDto, RoomPayload } from "@/types/room.types";

export const roomService = {
  getAll: async (): Promise<Room[]> => {
    const response = await apiClient.get<Room[]>("/Rooms");
    return response.data;
  },

  getById: async (id: number): Promise<Room> => {
    const response = await apiClient.get(`Rooms/${id}`);
    return response.data;
  },

  create: async (payload: RoomPayload): Promise<Room> => {
    const response = await apiClient.post<Room>("/Rooms", payload);
    return response.data;
  },

  update: async (id: number, payload: RoomPayload): Promise<Room> => {
    const response = await apiClient.put<Room>(`/Rooms/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Rooms/${id}`);
  },

  getMyRoom: async (): Promise<RoomDetailDto> => {
    const response = await apiClient.get("/Rooms/my-room");
    return response.data;
  },
};
