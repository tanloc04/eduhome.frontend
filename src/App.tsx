import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/LoginPage";
import Register from "./pages/auth/RegisterPage";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import StudentDashboard from "./pages/student/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import BuildingManager from "./pages/admin/BuildingManager";
import RoomManagementTabs from "./pages/admin/RoomManagementTabs";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/unauthorized"
              element={
                <div className="p-10 text-center text-red-500 font-bold text-2xl">
                  403 - BẠN KHÔNG CÓ QUYỀN TRUY CẬP KHU VỰC NÀY!
                </div>
              }
            />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
            {/* Route cho Portal Sinh viên */}
            <Route path="/student" element={<DashboardLayout />}>
              {/* Mặc định vào /student sẽ đẩy sang /student/dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} />

              {/* Tạm thời tạo 1 thẻ div để test giao diện Main Content */}
              <Route path="dashboard" element={<StudentDashboard />} />
              {/* Các trang khác sẽ thêm sau */}
            </Route>
          </Route>

          {/* PRIVATE ROUTES CHO BAN QUẢN LÝ (ADMIN / BUILDING MANAGER) */}
          {/* Chỉ cho Admin hoặc BuildingManager lọt qua */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["Admin", "BuildingManager"]} />
            }
          >
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              {/* Các trang quản lý phòng, sinh viên... sẽ nằm ở đây */}
              <Route path="rooms" element={<RoomManagementTabs />} />
              <Route path="buildings" element={<BuildingManager />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
