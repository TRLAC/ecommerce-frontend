import type { ReactNode } from "react";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Logo from "@/shared/components/Logo";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const PERKS = [
  { icon: Truck, title: "Giao hàng nhanh", text: "Theo dõi đơn hàng theo thời gian thực." },
  { icon: ShieldCheck, title: "Thanh toán an toàn", text: "Nhiều phương thức, thông tin được bảo vệ." },
  { icon: RotateCcw, title: "Hoàn tiền dễ dàng", text: "Yêu cầu hoàn tiền ngay trong đơn hàng." },
];

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Brand panel (desktop) */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl" />

        <div className="relative">
          <Logo light />
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Mua sắm thông minh,
            <br />
            giao tận nhà.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-violet-100">
            Hàng nghìn sản phẩm chính hãng với giá tốt mỗi ngày.
          </p>

          <ul className="mt-10 space-y-5">
            {PERKS.map(({ icon: Icon, title: t, text }) => (
              <li key={t} className="flex items-start gap-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                  <Icon size={20} />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{t}</span>
                  <span className="block text-sm text-violet-200">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-violet-200">© {new Date().getFullYear()} ShopVN. Demo project.</p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center bg-slate-50 px-5 py-10 sm:px-10 lg:bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9 lg:border-0 lg:p-0 lg:shadow-none">
            <header className="mb-7">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{subtitle}</p>
            </header>

            <div className="space-y-5">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
