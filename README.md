# EduHome - Student Dormitory Management System

## Giới thiệu tổng quan
EduHome là một hệ thống quản lý ký túc xá tập trung được phát triển nhằm giải quyết các hạn chế của quy trình quản lý thủ công (qua Excel). Dự án cung cấp giải pháp toàn diện từ khâu quản lý cơ sở vật chất, xét duyệt lưu trú, tự động hóa quy trình tài chính, cho đến hệ thống tương tác và báo cáo sự cố dành riêng cho sinh viên. 

Hệ thống được thiết kế với khả năng chịu tải cao, đảm bảo tính nhất quán dữ liệu trong các giao dịch tài chính và ngăn chặn tình trạng xung đột dữ liệu khi có lượng lớn truy cập đồng thời.

## Giao diện ứng dụng

[Chèn Hình ảnh 1: Màn hình Dashboard Tổng quan của Admin]
*Ghi chú: Màn hình thống kê tổng quan dữ liệu hoạt động của Ký túc xá.*

[Chèn Hình ảnh 2: Màn hình Quản lý Hóa đơn & Thu tiền]
*Ghi chú: Giao diện quản lý tài chính, tạo hóa đơn tự động và xử lý thanh toán.*

[Chèn Hình ảnh 3: Màn hình Student Portal - Trang thông tin cá nhân]
*Ghi chú: Không gian dành riêng cho sinh viên tra cứu thông tin và lịch sử lưu trú.*

[Chèn Hình ảnh 4: Màn hình Student Portal - Báo cáo sự cố]
*Ghi chú: Tính năng tạo yêu cầu sửa chữa cơ sở vật chất kèm hình ảnh minh họa.*

## Tính năng cốt lõi

### Phân hệ Quản trị (Admin/Manager Portal)
* **Quản lý cơ sở vật chất:** Định nghĩa sơ đồ tổ chức (Tòa nhà, Loại phòng, Phòng) và theo dõi trạng thái phòng theo thời gian thực.
* **Quản lý lưu trú:** Xét duyệt hồ sơ đăng ký phòng của sinh viên dựa trên điểm ưu tiên, tự động hóa việc xếp giường và tạo hợp đồng.
* **Quản lý tài chính tự động:** Thiết lập bảng giá dịch vụ, ghi nhận chỉ số điện/nước và hệ thống chạy ngầm để tính toán, phát hành hóa đơn hàng tháng.
* **Quản lý sự cố:** Tiếp nhận và xử lý các yêu cầu bảo trì từ sinh viên.

### Phân hệ Sinh viên (Student Portal)
* **Đăng ký phòng trực tuyến:** Tra cứu danh sách phòng trống và nộp đơn đăng ký.
* **Thanh toán và Công nợ:** Nhận thông báo hóa đơn, tra cứu lịch sử đóng phí và thanh toán trực tuyến qua cổng VNPay.
* **Tương tác:** Gửi ticket báo cáo sự cố cơ sở vật chất trực tiếp đến ban quản lý.

## Kiến trúc và Công nghệ

Dự án được xây dựng dựa trên các tiêu chuẩn phát triển phần mềm hiện đại, tách biệt rõ ràng giữa các tầng logic nghiệp vụ và tầng giao tiếp dữ liệu.

### Backend
* **Framework:** .NET 8 (ASP.NET Core Web API)
* **Architecture:** Clean Architecture kết hợp Repository Pattern và Unit of Work.
* **Database:** Microsoft SQL Server, tương tác qua Entity Framework Core.
* **Authentication:** ASP.NET Core Identity, JWT (JSON Web Token).
* **Data Mapping:** AutoMapper.

### Frontend
* **Library:** ReactJS (với Vite).
* **State Management:** Zustand (Global State) và TanStack Query (Server State, Caching, Mutation).
* **Styling:** Tailwind CSS, kết hợp các component UI từ PrimeReact/Lucide.
* **Networking:** Axios với cơ chế Interceptors xử lý xác thực.

## Các thách thức kỹ thuật đã giải quyết

1.  **Xử lý đồng thời (Concurrency) và Chống Over-booking:**
    Sử dụng cơ chế Database Transactions và Locking trong SQL Server để đảm bảo tính toàn vẹn dữ liệu. Khi có nhiều sinh viên cùng đăng ký vào một giường trống cuối cùng tại cùng một thời điểm, hệ thống đảm bảo chỉ có duy nhất một giao dịch thành công.

2.  **Tính toàn vẹn của Giao dịch tài chính (ACID):**
    Áp dụng triệt để Unit of Work trong các tác vụ phát hành hóa đơn hàng loạt hoặc thanh toán. Bất kỳ lỗi phát sinh nào giữa chừng đều kích hoạt Rollback toàn bộ chuỗi thao tác trước đó.

3.  **Bảo mật Webhook và tính Idempotency:**
    Xây dựng cơ chế xác thực chữ ký (Signature Verification) đối với dữ liệu từ cổng thanh toán VNPay trả về (qua IPN) nhằm chống giả mạo giao dịch. Đồng thời xử lý bài toán Idempotency, đảm bảo hệ thống không bị cộng dồn tiền hoặc sai lệch trạng thái hóa đơn khi Webhook bị gọi trùng lặp nhiều lần.

## Thiết kế Cơ sở dữ liệu

[Chèn Hình ảnh 5: Sơ đồ ERD của cơ sở dữ liệu]

Cơ sở dữ liệu được chuẩn hóa và chia thành các cụm nghiệp vụ chính:
* Cụm Xác thực & Thông tin Sinh viên (Students, AspNetUsers).
* Cụm Cơ sở vật chất (Buildings, RoomTypes, Rooms).
* Cụm Lưu trú (BookingRequests, Contracts).
* Cụm Tài chính (ServiceTypes, MeterReadings, Invoices, InvoiceDetails, Payments).

## Tài liệu dự án

Tài liệu phân tích thiết kế hệ thống chi tiết (bao gồm Use Case, Sequence Diagram, Flowchart) được lưu trữ tại thư mục `/docs`.

* [Tài liệu Đặc tả Yêu cầu Hệ thống (PDF)](/docs/EduHomeDocument.pdf)

## Hướng dẫn cài đặt môi trường

### Yêu cầu hệ thống
* .NET 8 SDK
* Node.js (v18 trở lên)
* Microsoft SQL Server

### Các bước triển khai
1. Cấu hình chuỗi kết nối cơ sở dữ liệu trong file `appsettings.json` của thư mục Backend.
2. Chạy lệnh `Update-Database` thông qua Package Manager Console hoặc Entity Framework CLI để khởi tạo các bảng và dữ liệu mẫu.
3. Khởi chạy Backend Application.
4. Di chuyển vào thư mục Frontend, chạy lệnh `npm install` để tải các thư viện phụ thuộc.
5. Chạy lệnh `npm run dev` để khởi động Client Application.
