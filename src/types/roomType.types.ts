export interface RoomType {
  id: number;
  name: string;
  capacity: number;
  basePrice: number;
}

export interface RoomTypePayload {
  name: string;
  capacity: number;
  basePrice: number;
}
