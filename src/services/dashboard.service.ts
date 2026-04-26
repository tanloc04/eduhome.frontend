import { apiClient } from "./apiClient"; // Nhớ dùng apiClient để nó tự động kẹp Token vào nhé
import type {
  StudentDashboardStats,
  AdminDashboardStats,
} from "@/types/dashboard.types";

export const dashboardService = {
  getStudentStats: async (): Promise<StudentDashboardStats> => {
    const response = await apiClient.get<StudentDashboardStats>(
      "/Dashboard/student-stats",
    );
    return response.data;
  },

  getAdminStats: async (): Promise<AdminDashboardStats> => {
    const response =
      await apiClient.get<AdminDashboardStats>("/Dashboard/stats");
    return response.data;
  },
};
