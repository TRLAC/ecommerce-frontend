import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

import AuthLayout from "@/features/auth/components/AuthLayout";
import { Field } from "@/features/auth/components/Field";
import { ErrorAlert } from "@/features/auth/components/ErrorAlert";
import { TogglePassword } from "@/features/auth/components/TogglePassword";
import { btnCls } from "@/shared/components/Button";
import { inputCls } from "@/shared/components/Input";
import { isNetworkError } from "@/shared/utils/apiError";

export default function LoginPage() {
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from;
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      navigate(user.roles.includes("ROLE_ADMIN") ? "/admin" : from ?? "/", { replace: true });
    } catch (err) {
      setError(
        isNetworkError(err)
          ? "Không kết nối được máy chủ. Vui lòng thử lại sau."
          : "Email hoặc mật khẩu không đúng."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Chào mừng trở lại" subtitle="Đăng nhập để tiếp tục mua sắm và theo dõi đơn hàng.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <ErrorAlert message={error} />}

        <Field label="Email" htmlFor="email">
          <div className="relative">
            <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              className={`${inputCls} pl-11`}
            />
          </div>
        </Field>

        <Field label="Mật khẩu" htmlFor="password">
          <div className="relative">
            <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              className={`${inputCls} pl-11 pr-12`}
            />
            <TogglePassword show={showPass} onToggle={() => setShowPass((v) => !v)} />
          </div>
        </Field>

        <button type="submit" disabled={loading} className={btnCls}>
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Đang đăng nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>

      <p className="pt-2 text-center text-sm text-slate-500">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="font-semibold text-violet-600 hover:text-violet-700 hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </AuthLayout>
  );
}
