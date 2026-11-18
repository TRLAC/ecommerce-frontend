import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ChevronDown, LayoutDashboard, LogOut, Menu, Package, ReceiptText, Store, Tags, Undo2, User as UserIcon, Users, X } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Logo from "@/shared/components/Logo";

type NavItem = { to: string; label: string; icon: ComponentType<{ size?: number }>; end?: boolean };

// Thêm mục menu mới ở đây khi có trang admin tương ứng (Orders, Refunds, Products...)
const NAV: NavItem[] = [
  { to: "/admin", label: "Tổng quan", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Đơn hàng", icon: ReceiptText },
  { to: "/admin/refunds", label: "Hoàn tiền", icon: Undo2 },
  { to: "/admin/products", label: "Sản phẩm", icon: Package },
  { to: "/admin/categories", label: "Danh mục", icon: Tags },
  { to: "/admin/users", label: "Người dùng", icon: Users },
];

const sideLinkCls = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? "bg-violet-600 text-white shadow-sm shadow-violet-600/30"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <Logo to="/admin" subtitle="Admin" />
        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="Đóng menu"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={sideLinkCls}>
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          <Store size={19} /> Xem cửa hàng
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block">{sidebar}</aside>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Mở menu"
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>
          <div className="hidden lg:block" />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-3 rounded-xl py-1.5 pl-1.5 pr-2 transition hover:bg-slate-100"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="hidden text-left md:block">
                <span className="block text-sm font-semibold leading-tight text-slate-900">{user?.fullName}</span>
                <span className="block text-xs text-slate-500">Quản trị viên</span>
              </span>
              <ChevronDown size={16} className={`hidden text-slate-400 transition md:block ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen && (
              <div role="menu" className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/60">
                <div className="px-3 py-2.5">
                  <p className="truncate text-sm font-semibold text-slate-900">{user?.fullName}</p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
                <div className="my-1 border-t border-slate-100" />
                <Link
                  to="/admin/profile"
                  role="menuitem"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                >
                  <UserIcon size={17} className="text-slate-400" /> Thông tin cá nhân
                </Link>
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
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
