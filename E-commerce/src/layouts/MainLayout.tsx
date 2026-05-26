import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function UserLayout() {
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = () => {

    const keyword = searchQuery.trim();

    if (!keyword) return;

    navigate(
      `/?keyword=${encodeURIComponent(keyword)}`
    );

    setShowSuggestions(false);

  };

  useEffect(() => {
    setOpen(false);
    setShowSuggestions(false);
  }, [location.pathname]);

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
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">

          {/* LEFT - Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white font-bold">
              S
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              ShopVN
            </h1>
          </Link>

          {/* CENTER - Search */}
          <div className="relative flex-1 max-w-xl" ref={searchRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
            <button  onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition">
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

          {/* RIGHT */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Nav links */}
            <Link className="hidden lg:block text-sm text-slate-600 hover:text-violet-600 px-3 py-1 transition" to="/">
              Trang chủ
            </Link>
            <Link className="hidden lg:block text-sm text-slate-600 hover:text-violet-600 px-3 py-1 transition" to="/categories">
              Danh mục
            </Link>
            <Link className="hidden lg:block text-sm text-slate-600 hover:text-violet-600 px-3 py-1 transition" to="/deals">
              Khuyến mãi
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative rounded-full p-2 hover:bg-slate-100 transition">
              ❤️
              <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">3</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative rounded-full p-2 hover:bg-slate-100 transition">
              🛒
              <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">5</span>
            </Link>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-xl p-2 transition hover:bg-slate-100"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-semibold text-sm">
                    {user?.fullName?.charAt(0)}
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium text-slate-700">
                  {user?.fullName?.split(" ").slice(-1)[0]}
                </span>
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                  <Link to="/profile" className="block rounded-xl px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition">
                    👤 Tài khoản của tôi
                  </Link>
                  <Link to="/orders" className="block rounded-xl px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition">
                    📦 Đơn hàng
                  </Link>
                  <Link to="/wishlist" className="block rounded-xl px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition">
                    ❤️ Yêu thích
                  </Link>
                  <Link to="/addresses" className="block rounded-xl px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition">
                    📍 Địa chỉ
                  </Link>
                  <div className="my-2 border-t border-slate-200" />
                  <button
                    className="w-full rounded-xl px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition"
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

      <main className="mx-auto max-w-7xl p-6">
        <Outlet />
      </main>

    </div>
  );
}