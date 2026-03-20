import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/LoginPage";
import Register from "./pages/auth/RegisterPage";
import StudentLayout from "./layouts/StudentLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Route cho Portal Sinh viên */}
        <Route path="/student" element={<StudentLayout />}>
          {/* Mặc định vào /student sẽ đẩy sang /student/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* Tạm thời tạo 1 thẻ div để test giao diện Main Content */}
          <Route 
            path="dashboard" 
            element={<div className="h-96 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-500 font-bold">Khu vực chứa Dashboard (Các thông báo, Số dư nợ...)</div>} 
          />
          {/* Các trang khác sẽ thêm sau */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
