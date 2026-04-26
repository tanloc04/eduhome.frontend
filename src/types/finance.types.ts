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

export interface InvoiceDetail {
  description: string;
  amount: number;
}

export interface StudentInvoice {
  id: string;
  studentName: string;
  studentCode: string;
  billingMonth: string;
  totalAmount: number;
  status: number; // Thường 1 là Chưa thanh toán, 2 là Đã thanh toán (tùy BE bạn quy định)
  details: InvoiceDetail[];
}

// Payload cho API nộp tiền thủ công
export interface ManualPaymentPayload {
  invoiceId: string;
  paymentMethod: number; // Thường quy ước: 0 là Tiền mặt (Cash), 1 là Chuyển khoản nội bộ...
  amountPaid: number;
  transactionId: string; // Mã phiếu thu giấy, hoặc ghi chú (VD: "PT-001")
}
