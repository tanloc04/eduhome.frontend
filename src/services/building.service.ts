import { apiClient } from "./apiClient";
import type { Building, BuildingPayload } from "@/types/building.types";

export const buildingService = {
  getAll: async (): Promise<Building[]> => {
    const response = await apiClient.get<Building[]>("/Buildings");
    return response.data;
  },

  getById: async (id: number): Promise<Building> => {
    const response = await apiClient.get<Building>(`/Buildings/${id}`);
    return response.data;
  },

  create: async (payload: BuildingPayload): Promise<Building> => {
    const response = await apiClient.post<Building>("/Buildings", payload);
    return response.data;
  },

  update: async (id: number, payload: BuildingPayload): Promise<Building> => {
    const response = await apiClient.put<Building>(`/Buildings/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Buildings/${id}`);
  },
};
