export interface ServiceType {
  id: number;
  name: string;
  unit: string;
  unitPrice: number;
}

export interface ServiceTypePayload {
  name: string;
  unit: string;
  unitPrice: number;
}

export interface MeterReading {
  id: number;
  roomId: number;
  serviceTypeId: number;
  billingMonth: string; // ISO string
  oldValue: number;
  newValue: number;
}

export interface MeterReadingPayload {
  roomId: number;
  serviceTypeId: number;
  billingMonth: string;
  oldValue: number;
  newValue: number;
}

export interface GenerateInvoicePayload {
  month: number;
  year: number;
}
