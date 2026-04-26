import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { issueService } from "@/services/issue.service";
import type { CreateIssuePayload } from "@/types/issue.types";

export const useIssues = () => {
  return useQuery({
    queryKey: ["issues"],
    queryFn: issueService.getAll,
  });
};

export const useUpdateIssueStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      issueService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateIssuePayload) =>
      issueService.createIssue(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
};
