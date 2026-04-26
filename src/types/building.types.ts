export interface Building {
  id: number;
  name: string;
  totalFloors: number;
}

export interface BuildingPayload {
  name: string;
  totalFloors: number;
}
