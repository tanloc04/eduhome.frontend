import { apiClient } from "./apiClient";
import type { CreateBookingPayload, BookingDto } from "@/types/booking.types";

export const bookingService = {
  createBooking: async (payload: CreateBookingPayload) => {
    const response = await apiClient.post("/Booking", payload);
    return response.data;
  },

  getMyBookings: async (): Promise<BookingDto[]> => {
    const response = await apiClient.get("/Booking/my-bookings");
    return response.data;
  },

  getAllBookings: async () => {
    const response = await apiClient.get("/Booking");
    return response.data;
  },

  approveBooking: async (id: number, payload: { roomId: number }) => {
    const response = await apiClient.put(`/Booking/${id}/approve`, payload);
    return response.data;
  },

  rejectBooking: async (id: number, payload: { reason: string }) => {
    const response = await apiClient.put(`/Booking/${id}/reject`, payload);
    return response.data;
  },
};
