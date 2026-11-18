import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDown, LogOut, Package, Search, Shield, ShoppingCart, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCart } from "@/features/Cart/hooks/useCart";
import Logo from "@/shared/components/Logo";

const NAV = [
  { to: "/", label: "Trang chủ", end: true },
  { to: "/orders", label: "Đơn hàng", end: false },
];

const navLinkCls = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export default function MainLayout() {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState(params.get("keyword") ?? "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.roles.includes("ROLE_ADMIN") ?? false;
  const isGuest = !user;

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = keyword.trim();
    navigate(q ? `/?keyword=${encodeURIComponent(q)}` : "/");
  };

  const searchBox = (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
      />
      <button
        type="submit"
        aria-label="Tìm kiếm"
        className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-violet-50 hover:text-violet-600"
      >
        <Search size={17} />
      </button>
    </form>
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.filter((n) => !isGuest || n.to === "/").map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={navLinkCls}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="mx-auto hidden w-full max-w-xl md:block">{searchBox}</div>

          <div className="ml-auto flex items-center gap-1.5 md:ml-0">
            <Link
              to="/cart"
              aria-label="Giỏ hàng"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-violet-600"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {isGuest ? (
              <div className="flex items-center gap-1.5">
                <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  Đăng nhập
                </Link>
                <Link to="/register" className="rounded-xl bg-violet-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
                  Đăng ký
                </Link>
              </div>
            ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2 transition hover:bg-slate-100"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="hidden max-w-[120px] truncate text-sm font-medium text-slate-700 sm:block">
                  {user?.fullName?.split(" ").slice(-1)[0]}
                </span>
                <ChevronDown size={16} className={`hidden text-slate-400 transition sm:block ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div role="menu" className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/60">
                  <div className="px-3 py-2.5">
                    <p className="truncate text-sm font-semibold text-slate-900">{user?.fullName}</p>
                    <p className="truncate text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <div className="my-1 border-t border-slate-100" />
                  <MenuLink to="/profile" icon={<UserIcon size={17} />} label="Tài khoản của tôi" />
                  <MenuLink to="/orders" icon={<Package size={17} />} label="Đơn hàng của tôi" />
                  {isAdmin && <MenuLink to="/admin" icon={<Shield size={17} />} label="Trang quản trị" />}
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={logout}
                    role="menuitem"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-red-500 transition hover:bg-red-50"
                  >
                    <LogOut size={17} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
            )}
          </div>
        </div>

        {/* Search (mobile) */}
        <div className="px-4 pb-3 md:hidden">{searchBox}</div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6">
          <Logo />
          <p>© {new Date().getFullYear()} ShopVN · Demo e-commerce (Spring Boot + React)</p>
        </div>
      </footer>
    </div>
  );
}

function MenuLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      role="menuitem"
      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
    >
      <span className="text-slate-400">{icon}</span>
      {label}
    </Link>
  );
}
