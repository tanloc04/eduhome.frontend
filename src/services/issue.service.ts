import { apiClient } from "./apiClient";
import type { IssueTicket, CreateIssuePayload } from "@/types/issue.types";

export const issueService = {
  // [ADMIN] Lấy danh sách sự cố
  getAll: async (): Promise<IssueTicket[]> => {
    const response = await apiClient.get<IssueTicket[]>("/IssueTickets");
    return response.data;
  },

  // [ADMIN] Đổi trạng thái sự cố
  updateStatus: async (id: number, status: number): Promise<any> => {
    const response = await apiClient.patch(`/IssueTickets/${id}/status`, {
      status,
    });
    return response.data;
  },

  // [STUDENT] Gửi yêu cầu sửa chữa (Có đính kèm file ảnh)
  createIssue: async (payload: CreateIssuePayload): Promise<any> => {
    const formData = new FormData();

    // Nạp dữ liệu vào FormData (Tên trường khớp với Swagger)
    formData.append("RoomId", payload.roomId.toString());
    formData.append("Title", payload.title);
    formData.append("Description", payload.description);

    // Nếu sinh viên có chọn ảnh thì mới append vào
    if (payload.imageFile) {
      formData.append("ImageFile", payload.imageFile);
    }

    const response = await apiClient.post("/IssueTickets", formData);
    return response.data;
  },
};
