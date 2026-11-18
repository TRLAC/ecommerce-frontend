import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";

/** Chặn user đã đăng nhập vào /login, /register. */
export default function GuestRoute() {
  const { accessToken, user } = useAuthStore();

  if (accessToken && user) {
    return <Navigate to={user.roles.includes("ROLE_ADMIN") ? "/admin" : "/"} replace />;
  }
  return <Outlet />;
}
