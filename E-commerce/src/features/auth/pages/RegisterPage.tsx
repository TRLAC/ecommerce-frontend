import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

import  AuthLayout  from "@/features/auth/components/AuthLayout";
import { Field } from "@/features/auth/components/Field";
import { ErrorAlert } from "@/features/auth/components/ErrorAlert";
import { TogglePassword } from "@/features/auth/components/TogglePassword";
import { btnCls } from "@/shared/components/Button";
import { inputCls } from "@/shared/components/Input";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
};

const getStrength = (p: string): 0 | 1 | 2 | 3 => {
  if (!p) return 0;
  if (p.length < 6) return 1;
  if (p.length < 10) return 2;
  return 3;
};

const STRENGTH = {
  0: { label: "", color: "" },
  1: { label: "Yếu",       color: "bg-red-500" },
  2: { label: "Trung bình", color: "bg-yellow-400" },
  3: { label: "Mạnh",      color: "bg-green-500" },
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState<RegisterForm>({
    name: "", email: "", password: "", confirmPassword: "", agreeTerms: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = getStrength(form.password);
  const passwordMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const validate = (): string => {
    if (!form.name.trim())                    return "Vui lòng nhập họ và tên.";
    if (!form.email.trim())                   return "Vui lòng nhập email.";
    if (form.password.length < 8)             return "Mật khẩu phải có ít nhất 8 ký tự.";
    if (form.password !== form.confirmPassword) return "Mật khẩu xác nhận không khớp.";
    if (!form.agreeTerms)                     return "Vui lòng đồng ý với điều khoản dịch vụ.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch {
      setError("Email này đã được đăng ký. Vui lòng thử email khác.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Tạo tài khoản" subtitle="Mua sắm dễ dàng hơn với tài khoản riêng">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorAlert message={error} />}

        <Field label="Họ và tên">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
            required
            className={inputCls}
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@email.com"
            required
            className={inputCls}
          />
        </Field>

        <Field label="Mật khẩu">
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Tối thiểu 8 ký tự"
              required
              className={`${inputCls} pr-10`}
            />
            <TogglePassword show={showPass} onToggle={() => setShowPass(!showPass)} />
          </div>
          {form.password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {([1, 2, 3] as const).map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full transition-all ${i <= strength ? STRENGTH[strength].color : "bg-gray-200"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">{STRENGTH[strength].label}</span>
            </div>
          )}
        </Field>

        <Field label="Xác nhận mật khẩu">
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              required
              className={`${inputCls} pr-10`}
            />
            <TogglePassword show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
          </div>
          {form.confirmPassword.length > 0 && (
            <p className={`text-xs mt-1 ${passwordMatch ? "text-green-600" : "text-red-500"}`}>
              {passwordMatch ? "Mật khẩu khớp" : "Mật khẩu không khớp"}
            </p>
          )}
        </Field>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={form.agreeTerms}
            onChange={handleChange}
            className="mt-0.5 accent-red-600"
          />
          <span className="text-sm text-gray-500">
            Tôi đồng ý với{" "}
            <Link to="/terms" className="text-red-600 font-medium hover:underline">Điều khoản dịch vụ</Link>
            {" "}và{" "}
            <Link to="/privacy" className="text-red-600 font-medium hover:underline">Chính sách bảo mật</Link>
          </span>
        </label>

        <button type="submit" disabled={loading} className={btnCls}>
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Đã có tài khoản?{" "}
        <Link to="/auth/login" className="text-red-600 font-medium hover:underline">
          Đăng nhập
        </Link>
      </p>
    </AuthLayout>
  );
}