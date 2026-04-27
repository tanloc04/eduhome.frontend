import { apiClient } from "./apiClient";
import type { IssueTicket, CreateIssuePayload } from "@/types/issue.types";

export const issueService = {
  // [ADMIN] Lấy danh sách sự cố
  getAll: async (): Promise<IssueTicket[]> => {
    const response = await apiClient.get<IssueTicket[]>("/IssueTickets");
    return response.data;
  },

  updateStatus: async (id: number, status: number): Promise<any> => {
    const response = await apiClient.patch(`/IssueTickets/${id}/status`, {
      status,
    });
    return response.data;
  },

  createIssue: async (payload: FormData): Promise<any> => {
    const response = await apiClient.post("/IssueTickets", payload);
    return response.data;
  },
};
