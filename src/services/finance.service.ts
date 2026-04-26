import { apiClient } from "./apiClient";
import type {
  ServiceType,
  ServiceTypePayload,
  MeterReadingPayload,
  GenerateInvoicePayload,
  StudentInvoice,
  ManualPaymentPayload,
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

  getAllInvoices: async (status?: number): Promise<any[]> => {
    const response = await apiClient.get("/Invoices", {
      params: status !== undefined ? { status } : {},
    });
    return response.data;
  },

  getMyInvoices: async (): Promise<StudentInvoice[]> => {
    const response = await apiClient.get("Invoices/my-invoices");
    return response.data;
  },

  createVnpayUrl: async (data: { invoiceId: string; content: string }) => {
    const response = await apiClient.post("Payments/create-payment-url", data);
    return response.data;
  },

  processManualPayment: async (payload: ManualPaymentPayload) => {
    const response = await apiClient.post("/Payments/process-manual", payload);
    return response.data;
  },
};
