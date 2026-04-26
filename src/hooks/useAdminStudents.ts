import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminStudentService } from "@/services/adminStudent.service";
import type { UpdateScoreDto, AssignRoomDto } from "@/types/adminStudent.types";

export const useAdminStudents = () => {
  return useQuery({
    queryKey: ["adminStudents"],
    queryFn: adminStudentService.getAll,
  });
};

export const useToggleStudentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminStudentService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStudents"] });
    },
  });
};

export const useUpdateStudentScore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateScoreDto }) =>
      adminStudentService.updateScore(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStudents"] });
    },
  });
};

export const useAssignStudentRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AssignRoomDto }) =>
      adminStudentService.assignRoom(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStudents"] });
    },
  });
};
