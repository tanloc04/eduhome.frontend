import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-cyan-100 via-blue-200 to-indigo-200 p-4">
      <main className="w-full max-w-md">
        <Outlet />
      </main>
    </div>
  );
}
