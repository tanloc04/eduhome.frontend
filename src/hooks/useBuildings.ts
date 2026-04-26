import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { buildingService } from "@/services/building.service";
import type { BuildingPayload } from "@/types/building.types";

export const useBuildings = () => {
  return useQuery({
    queryKey: ["buildings"],
    queryFn: buildingService.getAll,
  });
};

export const useBuilding = (id: number) => {
  return useQuery({
    queryKey: ["buildings", id],
    queryFn: () => buildingService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BuildingPayload) => buildingService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
};

export const useUpdateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BuildingPayload }) =>
      buildingService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
};

export const useDeleteBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => buildingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
};
