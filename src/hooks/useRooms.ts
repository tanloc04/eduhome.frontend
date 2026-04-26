import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomService } from "@/services/room.service";
import type { RoomPayload } from "@/types/room.types";

export const useRooms = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: roomService.getAll,
  });
};

export const useRoom = (id: number) => {
  return useQuery({
    queryKey: ["rooms", id],
    queryFn: () => roomService.getById(id),
    enabled: !!id,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RoomPayload) => roomService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RoomPayload }) =>
      roomService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => roomService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};

export const useMyRoom = () => {
  return useQuery({
    queryKey: ["my-room"],
    queryFn: roomService.getMyRoom,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
