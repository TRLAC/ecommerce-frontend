import { Link } from "react-router-dom";

type Props = { to?: string; subtitle?: string; light?: boolean };

export default function Logo({ to = "/", subtitle, light = false }: Props) {
  return (
    <Link to={to} className="flex flex-shrink-0 items-center gap-2.5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl text-base font-bold ${
          light ? "bg-white text-violet-700" : "bg-violet-600 text-white shadow-sm shadow-violet-600/30"
        }`}
      >
        S
      </span>
      <span className="leading-tight">
        <span className={`block text-lg font-bold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>
          ShopVN
        </span>
        {subtitle && (
          <span className={`block text-[11px] font-medium uppercase tracking-wider ${light ? "text-violet-200" : "text-slate-400"}`}>
            {subtitle}
          </span>
        )}
      </span>
    </Link>
  );
}
