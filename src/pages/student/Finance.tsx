import { useState } from "react";
import {
  Wallet,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  CreditCard,
} from "lucide-react";
import { useMyInvoices, useCreatePaymentUrl } from "@/hooks/useFinance";
import toast from "react-hot-toast";

export default function StudentFinance() {
  const { data: invoices = [], isLoading, isError } = useMyInvoices();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { mutate: createPayment, isPending: isCreatingPayment } =
    useCreatePaymentUrl();

  const handlePaymentClick = (invoiceId: string) => {
    createPayment(
      { invoiceId: invoiceId, content: `Thanh toan hoa don ${invoiceId}` },
      {
        onSuccess: (data) => {
          const redirectUrl =
            typeof data === "string" ? data : data?.url || data?.paymentUrl;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            toast.error("Không lấy được đường dẫn thanh toán từ hệ thống!");
          }
        },
        onError: (error: any) => {
          const backendMsg = error.response?.data;

          const displayMsg =
            typeof backendMsg === "string"
              ? backendMsg
              : backendMsg?.title ||
                backendMsg?.message ||
                "Có lỗi xảy ra khi kết nối VNPay!";

          toast.error(displayMsg);
        },
      },
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatMonth = (dateString: string) => {
    const date = new Date(dateString);
    return `Tháng ${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0: // Pending
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-semibold border border-orange-200">
            <Clock className="w-4 h-4" /> Chưa thanh toán
          </span>
        );
      case 1: // Success
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Đã thanh toán
          </span>
        );
      case 2: // Failed
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-sm font-semibold border border-rose-200">
            <AlertCircle className="w-4 h-4" /> Giao dịch lỗi
          </span>
        );
      default:
        return null;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500 font-medium">
        Đang tải dữ liệu tài chính...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-rose-500 font-medium">
        Lỗi khi tải hóa đơn! Vui lòng thử lại.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="w-7 h-7 text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-800">
            Tài chính sinh viên
          </h2>
        </div>
      </div>

      {/* DANH SÁCH HÓA ĐƠN */}
      {invoices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center flex flex-col items-center">
          <Receipt className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">
            Chưa có hóa đơn nào
          </h3>
          <p className="text-slate-500 mt-1">
            Hiện tại bạn không có khoản phí nào cần thanh toán.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                invoice.status === 0
                  ? "border-orange-300 shadow-md"
                  : "border-slate-200 shadow-sm"
              }`}
            >
              {/* PHẦN TÓM TẮT HÓA ĐƠN */}
              <div
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
                onClick={() => toggleExpand(invoice.id)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      invoice.status === 0
                        ? "bg-orange-100 text-orange-600"
                        : invoice.status === 1
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Hóa đơn {formatMonth(invoice.billingMonth)}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Mã HĐ:{" "}
                      <span className="font-mono text-xs">
                        {invoice.id.split("-")[0].toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-slate-500 font-medium mb-1">
                      Tổng thanh toán
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        invoice.status === 0
                          ? "text-orange-600"
                          : invoice.status === 1
                            ? "text-emerald-600"
                            : "text-rose-600"
                      }`}
                    >
                      {formatCurrency(invoice.totalAmount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(invoice.status)}
                    {expandedId === invoice.id ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* PHẦN CHI TIẾT */}
              {expandedId === invoice.id && (
                <div className="border-t border-slate-100 bg-slate-50 p-6 animate-in slide-in-from-top-2 duration-200">
                  <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                    Chi tiết khoản thu
                  </h4>
                  <div className="space-y-3 mb-6">
                    {invoice.details.map((detail, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-slate-700 bg-white p-3 rounded-lg border border-slate-100"
                      >
                        <span className="font-medium text-sm">
                          {detail.description}
                        </span>
                        <span className="font-bold">
                          {formatCurrency(detail.amount)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* ĐÃ SỬA: CHỈ HIỆN NÚT KHI STATUS === 0 (Chưa thanh toán) */}
                  {invoice.status === 0 && (
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handlePaymentClick(invoice.id)}
                        disabled={isCreatingPayment}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CreditCard className="w-5 h-5" />
                        {isCreatingPayment
                          ? "Đang chuyển hướng..."
                          : "Thanh toán ngay qua VNPay"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
