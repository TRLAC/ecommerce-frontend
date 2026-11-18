import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import PageLoader from "@/shared/components/PageLoader";

type Props = { allowedRoles?: string[] };

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { accessToken, user, isInitialized } = useAuthStore();

  if (!isInitialized) return <PageLoader />;

  // chưa đăng nhập
  if (!accessToken || !user) return <Navigate to="/login" replace />;

  // sai quyền
  if (allowedRoles?.length && !user.roles.some((r) => allowedRoles.includes(r))) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
