import { useState, useRef, useEffect } from "react";
import {
  Wrench,
  Send,
  Image as ImageIcon,
  X,
  UploadCloud,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
// Import hook của bạn vào đây (nhớ trỏ đúng đường dẫn nhé)
import { useCreateIssue } from "@/hooks/useIssues";
import { useMyRoom } from "@/hooks/useRooms";

export default function StudentSupport() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomId, setRoomId] = useState<number | "">("");

  // Xử lý file ảnh và preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createIssue, isPending } = useCreateIssue();
  const { data: myRoom, isLoading: isRoomLoading } = useMyRoom();

  useEffect(() => {
    if (myRoom?.id) {
      setRoomId(myRoom.id);
    }
  }, [myRoom]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate dung lượng ảnh (VD: max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Vui lòng chọn ảnh có dung lượng dưới 5MB!");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !title || !description) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    // Vì API yêu cầu multipart/form-data nên phải dùng FormData
    const formData = new FormData();
    formData.append("RoomId", roomId.toString());
    formData.append("Title", title);
    formData.append("Description", description);
    if (imageFile) {
      formData.append("ImageFile", imageFile);
    }

    try {
      // Ép kiểu (any) tạm thời nếu TS của bạn đang định nghĩa payload là object thường
      await createIssue(formData as any);

      toast.success("Đã gửi yêu cầu hỗ trợ thành công!");

      // Reset form
      setTitle("");
      setDescription("");
      setRoomId("");
      removeImage();
    } catch (error: any) {
      console.error("LỖI THẬT SỰ LÀ ĐÂY NÈ:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Có lỗi xảy ra khi gửi yêu cầu!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-8">
        <Wrench className="w-7 h-7 text-indigo-600" />
        <h2 className="text-2xl font-bold text-slate-800">
          Hỗ trợ & Báo cáo sự cố
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI: FORM NHẬP LIỆU */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg">
                Gửi yêu cầu mới
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Ban quản lý sẽ tiếp nhận và xử lý sự cố của bạn trong thời gian
                sớm nhất.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phòng của bạn <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled // Khóa không cho nhập tay
                    value={
                      isRoomLoading
                        ? "Đang tải thông tin..."
                        : myRoom
                          ? `Phòng ${myRoom.name?.replace("Phòng ", "")} - Tòa ${myRoom.buildingName}`
                          : "Bạn chưa được xếp phòng"
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-100 text-slate-600 font-medium cursor-not-allowed transition-shadow"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tiêu đề sự cố <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Hỏng bóng đèn, Rò rỉ nước..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mô tả chi tiết <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Vui lòng mô tả rõ tình trạng sự cố đang gặp phải..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hình ảnh đính kèm (Tùy chọn)
                </label>

                {/* Khu vực Upload / Preview Ảnh */}
                {!previewUrl ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-500 transition-all cursor-pointer cursor-pointer"
                  >
                    <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
                    <p className="text-sm font-medium mb-1">
                      Click để tải ảnh lên
                    </p>
                    <p className="text-xs text-slate-400">
                      PNG, JPG, JPEG (Max: 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative inline-block border border-slate-200 rounded-xl overflow-hidden group">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-48 w-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-colors shadow-lg"
                        title="Xóa ảnh"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Input file ẩn */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    "Đang gửi..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Gửi Yêu Cầu
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN HƯỚNG DẪN */}
        <div className="lg:col-span-1">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
            <h4 className="font-bold text-indigo-900 flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
              Lưu ý khi báo cáo
            </h4>
            <ul className="space-y-3 text-sm text-indigo-800/80">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></div>
                Mô tả càng chi tiết, ban quản lý càng dễ dàng chuẩn bị vật tư để
                sửa chữa.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></div>
                Nên đính kèm hình ảnh chụp rõ vị trí hoặc tình trạng hỏng hóc.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></div>
                Với các sự cố khẩn cấp (chập điện, cháy nổ), vui lòng gọi ngay
                hotline: <strong>0123.456.789</strong>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
