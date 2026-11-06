import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";

type Props = {
  allowedRoles?: string[];
};

export default function ProtectedRoute({ allowedRoles }: Props) {
    const { accessToken, user, isInitialized  } = useAuthStore();

  if (!isInitialized) {
  return (
    <div className="h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}

   // chưa login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // user chưa có (rare case)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // check role
  // if (allowedRoles && allowedRoles.length > 0) {
  //   const hasRole = user.roles.some((role) =>
  //     allowedRoles.includes(role)
  //   ) ?? false;
  //   if (!hasRole) {
  //     return <Navigate to="/403" replace />;
  //   }
  // }

  if (allowedRoles?.length) {
  const hasRole = (user?.roles ?? []).some((role) =>
    allowedRoles.includes(role)
  );

  if (!hasRole) {
    return <Navigate to="/403" replace />;
  }
}

  return <Outlet />;
}