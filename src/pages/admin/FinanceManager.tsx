import { useState, useMemo } from "react";
import {
  Receipt,
  Zap,
  Plus,
  Loader2,
  Calculator,
  Settings,
  Building2,
  FileText,
  Banknote,
  X,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  useServiceTypes,
  useCreateServiceType,
  useCreateMeterReading,
  useGenerateInvoices,
  useProcessManualPayment,
  useAllInvoices, // Đã import hook xịn xò của bạn vào đây
} from "@/hooks/useFinance";
import { useBuildings } from "@/hooks/useBuildings";
import { useRooms } from "@/hooks/useRooms";
import toast from "react-hot-toast";

export default function FinanceManager() {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);

  // --- STATE BỘ LỌC CHO TAB 4 ---
  const [invoiceFilter, setInvoiceFilter] = useState<number | undefined>(
    undefined,
  );

  // --- Hooks ---
  const { data: serviceTypes = [], isLoading: isServicesLoading } =
    useServiceTypes();
  const { data: buildings = [], isLoading: isBuildingsLoading } =
    useBuildings();
  const { data: rooms = [], isLoading: isRoomsLoading } = useRooms();

  // ĐÃ GẮN HOOK useAllInvoices KÈM FILTER VÀO ĐÂY
  const { data: allInvoices = [], isLoading: isInvoicesLoading } =
    useAllInvoices(invoiceFilter);

  const createServiceMutation = useCreateServiceType();
  const createMeterMutation = useCreateMeterReading();
  const generateInvoiceMutation = useGenerateInvoices();
  const processManualMutation = useProcessManualPayment();

  const isLoading = isServicesLoading || isBuildingsLoading || isRoomsLoading;

  // --- States for Forms ---
  const [serviceForm, setServiceForm] = useState({
    name: "",
    unit: "",
    unitPrice: 0,
  });

  const [meterForm, setMeterForm] = useState({
    buildingId: 0,
    roomId: 0,
    serviceTypeId: 0,
    billingMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
    oldValue: 0,
    newValue: 0,
  });

  const [invoiceForm, setInvoiceForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // States cho Modal Thu Tiền Mặt
  const [isManualPayOpen, setIsManualPayOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [manualForm, setManualForm] = useState({
    amountPaid: 0,
    transactionId: "",
  });

  // --- Handlers ---
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createServiceMutation.mutateAsync(serviceForm);
      setServiceForm({ name: "", unit: "", unitPrice: 0 });
      toast.success("Thêm dịch vụ thành công!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.Error ||
        "Lỗi khi thêm dịch vụ.";
      toast.error(errorMessage);
    }
  };

  const availableRooms = useMemo(() => {
    return rooms.filter((r) => r.buildingId === meterForm.buildingId);
  }, [rooms, meterForm.buildingId]);

  const handleCreateMeterReading = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fullDateStr = new Date(
        `${meterForm.billingMonth}-01T00:00:00Z`,
      ).toISOString();
      await createMeterMutation.mutateAsync({
        roomId: meterForm.roomId,
        serviceTypeId: meterForm.serviceTypeId,
        billingMonth: fullDateStr,
        oldValue: meterForm.oldValue,
        newValue: meterForm.newValue,
      });
      setMeterForm((prev) => ({ ...prev, oldValue: 0, newValue: 0 }));
      toast.success("Ghi chỉ số thành công!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.Error ||
        "Lỗi khi ghi chỉ số.";
      toast.error(errorMessage);
    }
  };

  const handleGenerateInvoices = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      window.confirm(
        `Bạn có chắc chắn muốn chốt hóa đơn cho tháng ${invoiceForm.month}/${invoiceForm.year}?`,
      )
    ) {
      try {
        const res = await generateInvoiceMutation.mutateAsync(invoiceForm);
        toast.success(res.message || "Tạo hóa đơn thành công!");
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.Error || "Có lỗi xảy ra khi tạo hóa đơn.";
        toast.error(errorMessage);
      }
    }
  };

  const openManualPayment = (invoice: any) => {
    setSelectedInvoice(invoice);
    setManualForm({
      amountPaid: invoice.totalAmount,
      transactionId: `PT-${Math.floor(Math.random() * 10000)}`,
    });
    setIsManualPayOpen(true);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      await processManualMutation.mutateAsync({
        invoiceId: selectedInvoice.id,
        paymentMethod: 0,
        amountPaid: manualForm.amountPaid,
        transactionId: manualForm.transactionId,
      });
      toast.success(
        `Đã thu ${manualForm.amountPaid.toLocaleString("vi-VN")}đ thành công!`,
      );
      setIsManualPayOpen(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.Error ||
        "Có lỗi xảy ra khi xử lý thanh toán!";
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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
        <Receipt className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-slate-800">
          Tài chính & Hóa đơn
        </h2>
      </div>

      {/* --- MENU TABS --- */}
      <div className="flex flex-wrap gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab(1)}
          className={`pb-3 px-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 1
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Settings className="w-4 h-4" /> Dịch vụ & Đơn giá
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`pb-3 px-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 2
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Zap className="w-4 h-4" /> Ghi chỉ số Điện/Nước
        </button>
        <button
          onClick={() => setActiveTab(3)}
          className={`pb-3 px-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 3
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Calculator className="w-4 h-4" /> Chốt Hóa đơn
        </button>
        <button
          onClick={() => setActiveTab(4)}
          className={`pb-3 px-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 4
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText className="w-4 h-4" /> Quản lý thu tiền
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 min-h-[500px]">
        {activeTab === 1 && (
          <div className="space-y-6">
            <form
              onSubmit={handleCreateService}
              className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-100"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên dịch vụ
                </label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, name: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Đơn vị
                </label>
                <input
                  type="text"
                  required
                  value={serviceForm.unit}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, unit: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="w-48">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Đơn giá (VNĐ)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={serviceForm.unitPrice}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      unitPrice: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={createServiceMutation.isPending}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" /> Thêm
              </button>
            </form>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                  <th className="p-4 font-semibold">Tên dịch vụ</th>
                  <th className="p-4 font-semibold">Đơn vị tính</th>
                  <th className="p-4 font-semibold">Đơn giá (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                {serviceTypes.map((st) => (
                  <tr
                    key={st.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-4 font-semibold text-slate-800">
                      {st.name}
                    </td>
                    <td className="p-4 text-slate-600">{st.unit}</td>
                    <td className="p-4 text-indigo-600 font-bold">
                      {st.unitPrice.toLocaleString()} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 2 && (
          <form
            onSubmit={handleCreateMeterReading}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tòa nhà
                </label>
                <select
                  required
                  value={meterForm.buildingId}
                  onChange={(e) => {
                    const bId = parseInt(e.target.value);
                    const newRooms = rooms.filter((r) => r.buildingId === bId);
                    setMeterForm({
                      ...meterForm,
                      buildingId: bId,
                      roomId: newRooms.length > 0 ? newRooms[0].id : 0,
                    });
                  }}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={0} disabled>
                    -- Chọn Tòa nhà --
                  </option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phòng
                </label>
                <select
                  required
                  value={meterForm.roomId}
                  onChange={(e) =>
                    setMeterForm({
                      ...meterForm,
                      roomId: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={0} disabled>
                    -- Chọn Phòng --
                  </option>
                  {availableRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Loại dịch vụ
                </label>
                <select
                  required
                  value={meterForm.serviceTypeId}
                  onChange={(e) =>
                    setMeterForm({
                      ...meterForm,
                      serviceTypeId: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={0} disabled>
                    -- Chọn dịch vụ --
                  </option>
                  {serviceTypes.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tháng chốt
                </label>
                <input
                  type="month"
                  required
                  value={meterForm.billingMonth}
                  onChange={(e) =>
                    setMeterForm({ ...meterForm, billingMonth: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Chỉ số đầu kỳ
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={meterForm.oldValue}
                  onChange={(e) =>
                    setMeterForm({
                      ...meterForm,
                      oldValue: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Chỉ số cuối kỳ
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={meterForm.newValue}
                  onChange={(e) =>
                    setMeterForm({
                      ...meterForm,
                      newValue: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={
                createMeterMutation.isPending ||
                meterForm.roomId === 0 ||
                meterForm.serviceTypeId === 0
              }
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {createMeterMutation.isPending
                ? "Đang lưu..."
                : "Ghi nhận chỉ số"}
            </button>
          </form>
        )}

        {activeTab === 3 && (
          <div className="max-w-md mx-auto py-8 text-center space-y-8">
            <div>
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Tạo Hóa Đơn Tự Động
              </h3>
              <p className="text-slate-500 text-sm">
                Hệ thống sẽ quét các hợp đồng đang hiệu lực và chỉ số điện/nước
                đã ghi để tạo hóa đơn cho từng sinh viên.
              </p>
            </div>
            <form onSubmit={handleGenerateInvoices} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                    Tháng
                  </label>
                  <select
                    value={invoiceForm.month}
                    onChange={(e) =>
                      setInvoiceForm({
                        ...invoiceForm,
                        month: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 text-center focus:ring-2 focus:ring-indigo-500"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        Tháng {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                    Năm
                  </label>
                  <input
                    type="number"
                    required
                    min={2020}
                    value={invoiceForm.year}
                    onChange={(e) =>
                      setInvoiceForm({
                        ...invoiceForm,
                        year:
                          parseInt(e.target.value) || new Date().getFullYear(),
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 text-center focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={generateInvoiceMutation.isPending}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                {generateInvoiceMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý dữ
                    liệu...
                  </>
                ) : (
                  <>
                    <Building2 className="w-5 h-5" /> Phát hành Hóa Đơn
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* --- TAB 4 ĐÃ ĐƯỢC NÂNG CẤP BỘ LỌC VÀ HOOK API --- */}
        {activeTab === 4 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">
                Danh sách hóa đơn sinh viên
              </h3>

              {/* BỘ LỌC HÓA ĐƠN */}
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setInvoiceFilter(undefined)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${invoiceFilter === undefined ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setInvoiceFilter(0)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${invoiceFilter === 0 ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Chưa thu
                </button>
                <button
                  onClick={() => setInvoiceFilter(1)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${invoiceFilter === 1 ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Đã thu
                </button>
              </div>
            </div>

            {isInvoicesLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            ) : allInvoices.length === 0 ? (
              <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                Không tìm thấy hóa đơn nào phù hợp.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                    <th className="p-4 font-semibold">Mã HĐ</th>
                    <th className="p-4 font-semibold">Sinh viên</th>
                    <th className="p-4 font-semibold">Tổng tiền</th>
                    <th className="p-4 font-semibold">Trạng thái</th>
                    <th className="p-4 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {allInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="p-4 font-mono text-sm">
                        {inv.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="p-4 font-medium text-slate-800">
                        {inv.studentName}
                      </td>
                      <td className="p-4 font-bold text-slate-700">
                        {inv.totalAmount.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="p-4">
                        {inv.status === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-50 text-orange-600 text-xs font-bold border border-orange-200">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {inv.status === 0 && (
                          <button
                            onClick={() => openManualPayment(inv)}
                            className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-600 hover:text-white transition-colors"
                          >
                            <Banknote className="w-4 h-4" /> Thu tiền
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {isManualPayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 text-indigo-600">
                <Banknote className="w-5 h-5" />
                <h3 className="font-bold text-lg text-slate-800">
                  Thu tiền tại quầy
                </h3>
              </div>
              <button
                onClick={() => setIsManualPayOpen(false)}
                className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="p-6 space-y-4">
              <div className="bg-orange-50 text-orange-700 p-3 rounded-lg text-sm mb-4 border border-orange-100">
                Đang thu tiền hóa đơn của:{" "}
                <strong className="block text-base">
                  {selectedInvoice?.studentName || "Sinh viên"}
                </strong>
                Mã HĐ:{" "}
                <span className="font-mono">
                  {selectedInvoice?.id?.substring(0, 8).toUpperCase()}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Số tiền thực thu (VNĐ)
                </label>
                <input
                  type="number"
                  required
                  value={manualForm.amountPaid}
                  onChange={(e) =>
                    setManualForm({
                      ...manualForm,
                      amountPaid: Number(e.target.value),
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 font-bold text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mã phiếu thu / Ghi chú
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.transactionId}
                  onChange={(e) =>
                    setManualForm({
                      ...manualForm,
                      transactionId: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  placeholder="VD: PT-001, Chuyển khoản Vietcombank..."
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsManualPayOpen(false)}
                  className="px-5 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={processManualMutation.isPending}
                  className="px-5 py-2.5 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {processManualMutation.isPending
                    ? "Đang xử lý..."
                    : "Xác nhận thu tiền"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
