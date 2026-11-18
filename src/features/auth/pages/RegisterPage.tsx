import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Loader2, Lock, Mail, User as UserIcon } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

import AuthLayout from "@/features/auth/components/AuthLayout";
import { Field } from "@/features/auth/components/Field";
import { ErrorAlert } from "@/features/auth/components/ErrorAlert";
import { TogglePassword } from "@/features/auth/components/TogglePassword";
import { btnCls } from "@/shared/components/Button";
import { inputCls } from "@/shared/components/Input";
import { getStatus, isNetworkError } from "@/shared/utils/apiError";

type RegisterForm = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Strength = 0 | 1 | 2 | 3;

const getStrength = (p: string): Strength => {
  if (!p) return 0;
  if (p.length < 8) return 1;
  const variety = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(p)).length;
  return p.length >= 10 && variety >= 3 ? 3 : 2;
};

const STRENGTH: Record<Strength, { label: string; color: string; text: string }> = {
  0: { label: "", color: "", text: "" },
  1: { label: "Yếu", color: "bg-red-500", text: "text-red-500" },
  2: { label: "Trung bình", color: "bg-amber-400", text: "text-amber-500" },
  3: { label: "Mạnh", color: "bg-emerald-500", text: "text-emerald-600" },
};

// Khớp validate của BE (RegisterRequest): fullName 2-100, password 8-72
const validate = (f: RegisterForm): string => {
  const name = f.fullName.trim();
  if (name.length < 2 || name.length > 100) return "Họ và tên phải từ 2 đến 100 ký tự.";
  if (!f.email.trim()) return "Vui lòng nhập email.";
  if (f.password.length < 8 || f.password.length > 72) return "Mật khẩu phải từ 8 đến 72 ký tự.";
  if (f.password !== f.confirmPassword) return "Mật khẩu xác nhận không khớp.";
  return "";
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState<RegisterForm>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = getStrength(form.password);
  const confirmTouched = form.confirmPassword.length > 0;
  const passwordMatch = confirmTouched && form.password === form.confirmPassword;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const err = validate(form);
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      await register(form.fullName.trim(), form.email.trim(), form.password);
      navigate("/", { replace: true });
    } catch (err2) {
      if (isNetworkError(err2)) setError("Không kết nối được máy chủ. Vui lòng thử lại sau.");
      else if (getStatus(err2) === 400) setError("Thông tin chưa hợp lệ hoặc email đã được đăng ký.");
      else setError("Email này đã được đăng ký. Vui lòng thử email khác.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Tạo tài khoản" subtitle="Chỉ mất một phút để bắt đầu mua sắm cùng ShopVN.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <ErrorAlert message={error} />}

        <Field label="Họ và tên" htmlFor="fullName">
          <div className="relative">
            <UserIcon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              required
              maxLength={100}
              className={`${inputCls} pl-11`}
            />
          </div>
        </Field>

        <Field label="Email" htmlFor="email">
          <div className="relative">
            <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
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
              name="password"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Tối thiểu 8 ký tự"
              required
              maxLength={72}
              className={`${inputCls} pl-11 pr-12`}
            />
            <TogglePassword show={showPass} onToggle={() => setShowPass((v) => !v)} />
          </div>
          {form.password.length > 0 && (
            <div className="mt-2.5">
              <div className="flex gap-1.5">
                {([1, 2, 3] as const).map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i <= strength ? STRENGTH[strength].color : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <p className={`mt-1.5 text-xs font-medium ${STRENGTH[strength].text}`}>
                Độ mạnh: {STRENGTH[strength].label}
              </p>
            </div>
          )}
        </Field>

        <Field label="Xác nhận mật khẩu" htmlFor="confirmPassword">
          <div className="relative">
            <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              required
              maxLength={72}
              className={`${inputCls} pl-11 pr-12`}
            />
            <TogglePassword show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
          </div>
          {confirmTouched && (
            <p
              className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${
                passwordMatch ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {passwordMatch && <Check size={14} />}
              {passwordMatch ? "Mật khẩu khớp" : "Mật khẩu không khớp"}
            </p>
          )}
        </Field>

        <button type="submit" disabled={loading} className={btnCls}>
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Đang tạo tài khoản...
            </>
          ) : (
            "Đăng ký"
          )}
        </button>
      </form>

      <p className="pt-2 text-center text-sm text-slate-500">
        Đã có tài khoản?{" "}
        <Link to="/login" className="font-semibold text-violet-600 hover:text-violet-700 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </AuthLayout>
  );
}
