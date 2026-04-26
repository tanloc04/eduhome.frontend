export interface IssueTicket {
  id: number;
  title: string;
  description: string;
  status: number; // 0: Pending, 1: InProgress, 2: Resolved, 3: Rejected
  createdAt: string;
  studentName?: string;
  roomName?: string;
  imageUrl?: string; // Nhận URL ảnh từ server (nếu có)
}

// Payload khi sinh viên submit form (có chứa File)
export interface CreateIssuePayload {
  roomId: number;
  title: string;
  description: string;
  imageFile: File | null;
}
