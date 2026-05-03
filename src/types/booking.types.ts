export interface CreateBookingPayload {
  roomTypeId: number;
  semester: string;
}

export interface BookingDto {
  id: number;
  studentCode: string;
  studentName: string;
  roomType: string;
  semester: string;
  note: string | null;
  status: number;
}
