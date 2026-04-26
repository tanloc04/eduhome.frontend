import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { roomTypeService } from "@/services/roomType.service";
import type { RoomTypePayload } from "@/types/roomType.types";

export const useRoomTypes = () => {
  return useQuery({
    queryKey: ["roomTypes"],
    queryFn: roomTypeService.getAll,
  });
};

export const useRoomType = (id: number) => {
  return useQuery({
    queryKey: ["roomTypes", id],
    queryFn: () => roomTypeService.getById(id),
    enabled: !!id,
  });
};

export const useCreateRoomType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RoomTypePayload) => roomTypeService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomTypes"] });
    },
  });
};

export const useUpdateRoomType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RoomTypePayload }) =>
      roomTypeService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomTypes"] });
    },
  });
};

export const useDeleteRoomType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => roomTypeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomTypes"] });
    },
  });
};
