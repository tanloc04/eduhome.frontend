import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
// import { CreateBookingPayload } from "@/types/booking.types";

export const useMyBookings = () => {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: bookingService.getMyBookings,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any /* CreateBookingPayload */) =>
      bookingService.createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });
};
