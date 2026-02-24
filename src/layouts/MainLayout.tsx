import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="flex w-full h-screen overflow-hidden">
        {/* Left Side: Branding / Imagery (Hidden on mobile/tablet, shown on PC) */}
        <div className="hidden lg:flex flex-col relative w-1/2 bg-blue-700 text-white justify-center items-center overflow-hidden">
          {/* Animated decorative blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-400 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          <div className="z-10 flex flex-col items-center text-center p-12 space-y-6">
            <h1 className="text-5xl xl:text-7xl font-extrabold tracking-tight mb-2 drop-shadow-md">
              Edu<span className="text-cyan-300">Home</span>
            </h1>
            <p className="text-lg xl:text-xl font-medium text-blue-100 max-w-md leading-relaxed">
              Hệ thống quản lý Ký túc xá thông minh, tiện lợi và an toàn dành cho sinh viên.
            </p>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-16 lg:p-24 xl:p-32 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 lg:bg-none lg:bg-slate-50 overflow-y-auto">
          <main className="w-full max-w-md xl:max-w-lg transition-all duration-300">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
