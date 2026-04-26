import { useState } from "react";
import {
  Wrench,
  Loader2,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  ImageIcon,
} from "lucide-react";
import { useIssues, useUpdateIssueStatus } from "@/hooks/useIssues";
import toast from "react-hot-toast";

export default function IssueManager() {
  const { data: issues = [], isLoading } = useIssues();
  const updateStatusMutation = useUpdateIssueStatus();

  // Map các trạng thái từ Backend (bạn check lại Enum bên BE xem có khớp 0,1,2,3 không nhé)
  const statusOptions = [
    {
      value: 0,
      label: "Chờ xử lý",
      color: "text-red-700 bg-red-100",
      icon: Clock,
    },
    {
      value: 1,
      label: "Đang sửa chữa",
      color: "text-orange-700 bg-orange-100",
      icon: Wrench,
    },
    {
      value: 2,
      label: "Đã hoàn thành",
      color: "text-green-700 bg-green-100",
      icon: CheckCircle2,
    },
    {
      value: 3,
      label: "Từ chối",
      color: "text-slate-700 bg-slate-100",
      icon: XCircle,
    },
  ];

  const handleStatusChange = async (id: number, newStatus: number) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.Error || "Lỗi khi cập nhật trạng thái.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Wrench className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-slate-800">
          Quản lý Sự cố & Sửa chữa
        </h2>
      </div>

      <div className="grid gap-4">
        {issues.length === 0 ? (
          <div className="bg-white p-12 flex flex-col items-center justify-center text-slate-500 rounded-2xl border border-slate-200 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-green-400 mb-3" />
            <p className="text-lg font-medium">
              Tuyệt vời! Không có sự cố nào đang chờ xử lý.
            </p>
          </div>
        ) : (
          issues.map((issue) => {
            const currentStatus =
              statusOptions.find((s) => s.value === issue.status) ||
              statusOptions[0];
            const StatusIcon = currentStatus.icon;

            return (
              <div
                key={issue.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 transition-all hover:shadow-md"
              >
                <div
                  className={`p-3 rounded-full shrink-0 ${currentStatus.color}`}
                >
                  <StatusIcon className="w-6 h-6" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">
                        {issue.title}
                      </h3>
                      <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <span className="font-medium text-indigo-600">
                          Phòng: {issue.roomName || "Chưa rõ"}
                        </span>
                        <span>•</span>
                        <span>SV: {issue.studentName || "Ẩn danh"}</span>
                        <span>•</span>
                        <span>
                          {new Date(issue.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </span>
                      </div>
                    </div>

                    {/* DROPDOWN ĐỔI TRẠNG THÁI */}
                    <select
                      value={issue.status}
                      disabled={updateStatusMutation.isPending}
                      onChange={(e) =>
                        handleStatusChange(issue.id, parseInt(e.target.value))
                      }
                      className={`font-bold text-sm rounded-lg px-3 py-1.5 border-0 cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${currentStatus.color}`}
                    >
                      {statusOptions.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="bg-white text-slate-800"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-slate-600 text-sm whitespace-pre-wrap">
                        {issue.description}
                      </p>
                    </div>

                    {/* HIỂN THỊ ẢNH ĐÍNH KÈM (NẾU CÓ) */}
                    {issue.imageUrl && (
                      <div className="ml-8 mt-2">
                        <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> Ảnh đính kèm:
                        </p>
                        <a
                          href={issue.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={issue.imageUrl}
                            alt="Hình ảnh sự cố"
                            className="max-w-[200px] max-h-[200px] rounded-lg border border-slate-200 object-cover hover:opacity-80 transition-opacity cursor-zoom-in shadow-sm"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
