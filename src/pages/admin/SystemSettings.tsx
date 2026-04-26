import { useState } from "react";
import {
  Settings,
  User,
  FileText,
  Sliders,
  Save,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);

  // --- Mock States ---
  const [paramsForm, setParamsForm] = useState({
    defaultScore: 100,
    paymentDeadlineDays: 5,
    maintenanceEmail: "support@eduhome.com",
  });

  const [profileForm, setProfileForm] = useState({
    fullName: "Admin Đẹp Trai",
    phone: "0987654321",
    oldPassword: "",
    newPassword: "",
  });

  const [rules, setRules] = useState(
    "1. Không về trễ sau 11h đêm.\n2. Giữ gìn vệ sinh chung.\n3. Đóng tiền phòng đúng hạn.",
  );

  // --- Handlers (Mô phỏng gọi API) ---
  const handleSaveParams = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Đã lưu các tham số hệ thống!");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Đã cập nhật thông tin tài khoản!");
  };

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Đã cập nhật Nội quy Ký túc xá!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-slate-800">Cài đặt hệ thống</h2>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab(1)}
          className={`pb-3 px-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 1
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Sliders className="w-4 h-4" /> Tham số chung
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`pb-3 px-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 2
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <User className="w-4 h-4" /> Tài khoản của tôi
        </button>
        <button
          onClick={() => setActiveTab(3)}
          className={`pb-3 px-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 3
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText className="w-4 h-4" /> Nội quy KTX
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 max-w-4xl">
        {/* TAB 1: THAM SỐ CHUNG */}
        {activeTab === 1 && (
          <form
            onSubmit={handleSaveParams}
            className="space-y-6 animate-in fade-in duration-300"
          >
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
              Cấu hình vận hành
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Điểm rèn luyện mặc định (Tân sinh viên)
                </label>
                <input
                  type="number"
                  value={paramsForm.defaultScore}
                  onChange={(e) =>
                    setParamsForm({
                      ...paramsForm,
                      defaultScore: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Hạn chót thanh toán hóa đơn (Số ngày)
                </label>
                <input
                  type="number"
                  value={paramsForm.paymentDeadlineDays}
                  onChange={(e) =>
                    setParamsForm({
                      ...paramsForm,
                      paymentDeadlineDays: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email tiếp nhận sự cố kỹ thuật
                </label>
                <input
                  type="email"
                  value={paramsForm.maintenanceEmail}
                  onChange={(e) =>
                    setParamsForm({
                      ...paramsForm,
                      maintenanceEmail: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <Save className="w-4 h-4" /> Lưu cấu hình
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: TÀI KHOẢN CỦA TÔI */}
        {activeTab === 2 && (
          <form
            onSubmit={handleSaveProfile}
            className="space-y-6 animate-in fade-in duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-2xl">
                A
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Quản trị viên
                </h3>
                <p className="text-sm text-slate-500">admin@eduhome.com</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, fullName: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" /> Đổi mật khẩu
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <Save className="w-4 h-4" /> Cập nhật tài khoản
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: NỘI QUY KTX */}
        {activeTab === 3 && (
          <form
            onSubmit={handleSaveRules}
            className="space-y-6 animate-in fade-in duration-300"
          >
            <div>
              <div className="flex justify-between items-end mb-2">
                <h3 className="text-lg font-bold text-slate-800">
                  Biên soạn Nội quy
                </h3>
                <span className="text-sm text-slate-500">
                  Hiển thị trực tiếp trên Portal Sinh viên
                </span>
              </div>
              {/* Lưu ý: Sau này rảnh bạn có thể thay textarea này bằng 1 bộ Rich Text Editor (như React Quill hay TinyMCE) cho xịn */}
              <textarea
                rows={12}
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 font-mono text-sm leading-relaxed"
                placeholder="Nhập nội quy ký túc xá tại đây..."
              />
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <Save className="w-4 h-4" /> Xuất bản Nội quy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
