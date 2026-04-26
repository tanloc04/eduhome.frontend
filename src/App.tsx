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
import StudentManager from "./pages/admin/StudentManager";
import FinanceManager from "./pages/admin/FinanceManager";
import { Toaster } from "react-hot-toast";
import IssueManager from "./pages/admin/IssueManager";
import SystemSettings from "./pages/admin/SystemSettings";
import StudentProfile from "./pages/student/Profile";

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
              <Route path="profile" element={<StudentProfile />} />
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
              <Route path="students" element={<StudentManager />} />
              <Route path="finance" element={<FinanceManager />} />
              <Route path="issues" element={<IssueManager />} />
              <Route path="settings" element={<SystemSettings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
    </QueryClientProvider>
  );
}

export default App;
