import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "@/services/finance.service";
import type {
  ServiceTypePayload,
  MeterReadingPayload,
  GenerateInvoicePayload,
} from "@/types/finance.types";

// Dịch vụ
export const useServiceTypes = () => {
  return useQuery({
    queryKey: ["serviceTypes"],
    queryFn: financeService.getServiceTypes,
  });
};

export const useCreateServiceType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ServiceTypePayload) =>
      financeService.createServiceType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceTypes"] });
    },
  });
};

// Ghi điện nước
export const useCreateMeterReading = () => {
  return useMutation({
    mutationFn: (payload: MeterReadingPayload) =>
      financeService.createMeterReading(payload),
  });
};

// Chốt hóa đơn
export const useGenerateInvoices = () => {
  return useMutation({
    mutationFn: (payload: GenerateInvoicePayload) =>
      financeService.generateMonthlyInvoices(payload),
  });
};
