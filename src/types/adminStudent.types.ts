export interface AdminStudentResponseDto {
  id: number;
  fullName: string;
  studentCode: string;
  major: string;
  priorityScore: number;
  isActive: boolean;
  roomId?: number | null;
  roomName?: string | null;
  buildingName?: string | null;
}

export interface UpdateScoreDto {
  points: number;
  reason?: string;
}

export interface AssignRoomDto {
  roomId?: number | null;
}
