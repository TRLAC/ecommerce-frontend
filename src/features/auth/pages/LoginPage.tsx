import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

import  AuthLayout   from "@/features/auth/components/AuthLayout";
import { Field } from "@/features/auth/components/Field";
import { ErrorAlert } from "@/features/auth/components/ErrorAlert";
import { TogglePassword } from "@/features/auth/components/TogglePassword";
import { Divider } from "@/features/auth/components/Divider";
import { SocialButtons } from "@/features/auth/components/SocialButtons";
import { btnCls } from "@/shared/components/Button";
import { inputCls } from "@/shared/components/Input";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
       const user = await login(email, password);
      if (user.roles.includes("ROLE_ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/");
      }

         console.log(user.roles);
    } catch {
      setError("Email hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Chào mừng trở lại" subtitle="Đăng nhập vào tài khoản của bạn">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorAlert message={error} />}

        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
            className={inputCls}
          />
        </Field>

        <Field label="Mật khẩu">
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              className={`${inputCls} pr-10`}
            />
            <TogglePassword show={showPass} onToggle={() => setShowPass(!showPass)} />
          </div>
          <div className="flex justify-between items-center mt-2">
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
              <input type="checkbox" className="accent-red-600" />
              Ghi nhớ đăng nhập
            </label>
            <Link to="/auth/forgot-password" className="text-sm text-red-600 font-medium hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
        </Field>

        <button type="submit" disabled={loading} className={btnCls}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <Divider />
      <SocialButtons />

      <p className="text-center text-sm text-gray-500 mt-5">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-red-600 font-medium hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </AuthLayout>
  );
}
