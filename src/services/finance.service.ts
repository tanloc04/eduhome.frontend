import { apiClient } from "./apiClient";
import type {
  ServiceType,
  ServiceTypePayload,
  MeterReadingPayload,
  GenerateInvoicePayload,
} from "@/types/finance.types";

export const financeService = {
  // --- Service Types ---
  getServiceTypes: async (): Promise<ServiceType[]> => {
    const response = await apiClient.get<ServiceType[]>("/ServiceTypes");
    return response.data;
  },
  createServiceType: async (
    payload: ServiceTypePayload,
  ): Promise<ServiceType> => {
    const response = await apiClient.post<ServiceType>(
      "/ServiceTypes",
      payload,
    );
    return response.data;
  },

  // --- Meter Readings ---
  createMeterReading: async (payload: MeterReadingPayload): Promise<any> => {
    const response = await apiClient.post("/MeterReadings", payload);
    return response.data;
  },

  // --- Invoices ---
  generateMonthlyInvoices: async (
    payload: GenerateInvoicePayload,
  ): Promise<{ message: string; count: number }> => {
    const response = await apiClient.post(
      "/Invoices/generate-monthly",
      payload,
    );
    return response.data;
  },
};
