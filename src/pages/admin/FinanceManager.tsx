import { useState, useMemo } from "react";
import {
  Receipt,
  Zap,
  Plus,
  Loader2,
  Calculator,
  Settings,
  Building2,
} from "lucide-react";
import {
  useServiceTypes,
  useCreateServiceType,
  useCreateMeterReading,
  useGenerateInvoices,
} from "@/hooks/useFinance";
import { useBuildings } from "@/hooks/useBuildings";
import { useRooms } from "@/hooks/useRooms";
import toast from "react-hot-toast";

export default function FinanceManager() {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);

  // --- Hooks ---
  const { data: serviceTypes = [], isLoading: isServicesLoading } =
    useServiceTypes();
  const { data: buildings = [], isLoading: isBuildingsLoading } =
    useBuildings();
  const { data: rooms = [], isLoading: isRoomsLoading } = useRooms();

  const createServiceMutation = useCreateServiceType();
  const createMeterMutation = useCreateMeterReading();
  const generateInvoiceMutation = useGenerateInvoices();

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

  // --- Handlers ---
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createServiceMutation.mutateAsync(serviceForm);
      setServiceForm({ name: "", unit: "", unitPrice: 0 });
      alert("Thêm dịch vụ thành công!");
    } catch (error: any) {
      console.error(error);
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
      // Convert YYYY-MM to full ISO string for backend
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
      alert("Ghi chỉ số thành công!");
    } catch (error: any) {
      console.error(error);
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
        alert(res.message);
      } catch (error: any) {
        console.error(error);
        const errorMessage =
          error.response?.data?.Error || "Có lỗi xảy ra khi tạo hóa đơn.";
        toast.error(errorMessage);
      }
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
        <Receipt className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-slate-800">
          Tài chính & Hóa đơn
        </h2>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
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
          <Calculator className="w-4 h-4" /> Chốt Hóa đơn tháng
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        {/* TAB 1: SERVICE TYPES */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <form
              onSubmit={handleCreateService}
              className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-100"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên dịch vụ (VD: Tiền điện)
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
                  Đơn vị (VD: kWh)
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

        {/* TAB 2: METER READINGS */}
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
                  Tháng chốt (Tháng/Năm)
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
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              {createMeterMutation.isPending
                ? "Đang lưu..."
                : "Ghi nhận chỉ số"}
            </button>
          </form>
        )}

        {/* TAB 3: GENERATE INVOICES */}
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
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
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
      </div>
    </div>
  );
}
