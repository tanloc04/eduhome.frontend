export interface Room {
  id: number;
  name: string;
  buildingId: number;
  roomTypeId: number;
  status: number;
}

export interface RoomPayload {
  name: string;
  buildingId: number;
  roomTypeId: number;
  status: number;
}

export interface RoomDetailDto {
  id: number;
  name: string;
  floor: number;
  status: number;
  buildingId: number;
  buildingName: string;
  roomTypeId: number;
  roomTypeName: string;
  capacity: number;
  basePrice: number;
  roommates: RoommateDto[];
}

export interface RoommateDto {
  studentCode: string;
  fullName: string;
  isMe: boolean;
}
