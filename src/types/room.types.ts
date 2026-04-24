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
