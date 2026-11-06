import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

   // ✅ Đóng dropdown khi navigate
  useEffect(() => {
    setOpen(false);
    setShowSuggestions(false);
  }, [location.pathname]);

  // ✅ Đóng dropdown khi click ra ngoài
 useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
        
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

              {/* LEFT - Logo */}
            <Link
              to="/admin"
              className="flex items-center gap-3"
            > 
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white font-bold">
                A
              </div>

              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Admin
              </h1>

            </Link>

            {/* CENTER - Search */}
          <div className="relative flex-1 max-w-xl" ref={searchRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition">
              🔍
            </button>

            {/* Suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute top-full mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
                <p className="px-4 py-2 text-xs text-slate-400">Tìm kiếm gần đây</p>
                {["Áo thun nam oversize", "Giày sneaker trắng"].map((item) => (
                  <button
                    key={item}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition"
                    onClick={() => { setSearchQuery(item); setShowSuggestions(false); }}
                  >
                    🕐 {item}
                  </button>
                ))}
                <p className="px-4 py-2 text-xs text-slate-400">Phổ biến</p>
                {["Tai nghe không dây", "Ốp lưng điện thoại"].map((item) => (
                  <button
                    key={item}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition"
                    onClick={() => { setSearchQuery(item); setShowSuggestions(false); }}
                  >
                    🔥 {item}
                  </button>
                ))}
              </div>
            )}
          </div>

             {/* CENTER - Menu */}
            <div className="flex items-center gap-8">
              <Link
                className="text-sm font-medium text-slate-600 transition hover:text-violet-600"
                to="/admin"
              >
                Dashboard
              </Link>

              <Link
                className="text-sm font-medium text-slate-600 transition hover:text-violet-600"
                to="/admin/products"
              >
                Products
              </Link>

              <Link
                className="text-sm font-medium text-slate-600 transition hover:text-violet-600"
                to="/admin/users"
              >
                Users
              </Link>
          </div>

              {/* RIGHT - User */}
          <div className="flex items-center gap-4">
            
            {/* Notification */}
            <button className="relative rounded-full p-2 transition hover:bg-slate-100">
              🔔<span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* User */}
           <div className="relative" ref={dropdownRef}>

              {/* User Button */}
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-100"
              >
              
               {/* Avatar */}
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-white font-semibold">
                  {user?.fullName?.charAt(0)}
                </div>
              )}

              {/* Info */}
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.fullName}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.email}
                </p>
              </div>

              </button>

              {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">

                     {/* Profile */}
                    <Link
                      to="/admin/profile"
                      className="block rounded-xl px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      👤 Thông tin cá nhân
                    </Link>

                    <Link
                      to="/settings"
                      className="block rounded-xl px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      ⚙️ Cài đặt
                    </Link>

                    <div className="my-2 border-t border-slate-200"></div>

                    <button
                      className="w-full rounded-xl px-4 py-2 text-left text-sm text-red-500 transition hover:bg-red-50"
                      onClick={logout}
                    >
                      🚪 Đăng xuất
                    </button>

                  </div>
                )}

            </div>
          </div>
          
        </div>
      </nav>
  

      {/* Content */}
      <main  className="mx-auto max-w-7xl p-6">
        <Outlet />
      </main>

    </div>
  );
}