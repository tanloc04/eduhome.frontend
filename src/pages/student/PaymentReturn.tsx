import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { apiClient } from "@/services/apiClient";

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Lấy toàn bộ query string trên URL mà VNPay ném về (VD: ?vnp_Amount=...&vnp_ResponseCode=00...)
        const queryString = searchParams.toString();

        // Gọi xuống BE để BE xác minh chữ ký (Checksum)
        const response = await apiClient.get(
          `/api/Payments/vnpay-return?${queryString}`,
        );

        // Tuỳ BE trả về status gì để quyết định thành công hay thất bại
        if (response.data?.success || response.status === 200) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    };

    if (searchParams.toString()) {
      verifyPayment();
    } else {
      setStatus("error"); // Không có tham số gì mà đi lạc vào đây
    }
  }, [searchParams]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center animate-in fade-in">
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-slate-800">
              Đang xác minh giao dịch...
            </h2>
            <p className="text-slate-500 mt-2">
              Vui lòng không đóng trình duyệt lúc này.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <CheckCircle className="w-20 h-20 text-emerald-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">
              Thanh toán thành công!
            </h2>
            <p className="text-slate-500 mt-2">
              Cảm ơn bạn đã hoàn thành nghĩa vụ tài chính.
            </p>
            <button
              onClick={() => navigate("/student/finance")}
              className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 w-full"
            >
              Trở về trang Tài chính
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <XCircle className="w-20 h-20 text-rose-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">
              Thanh toán thất bại!
            </h2>
            <p className="text-slate-500 mt-2">
              Giao dịch bị hủy hoặc có lỗi xảy ra. Tiền chưa bị trừ.
            </p>
            <button
              onClick={() => navigate("/student/finance")}
              className="mt-6 bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-200 w-full"
            >
              Quay lại thử lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
