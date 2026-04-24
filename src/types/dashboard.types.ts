export interface StudentDashboardStats {
  currentDebt: number;
  debtDueDate: string | null;
  trainingPoints: number;
  pointClassification: string;
  nextSemesterName: string;
  nextSemesterOpenDate: string | null;
}

export interface AdminDashboardStats {
  totalRevenue: number;
  unpaidInvoicesCount: number;
  totalUnpaidAmount: number;
  pendingTicketsCount: number;
  totalActiveStudents: number;
}
