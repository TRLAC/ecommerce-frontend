import { Outlet } from "react-router-dom";

// Giao diện (card, brand panel) nằm trong features/auth/components/AuthLayout,
// layout route chỉ cần render trang con.
export default function AuthLayout() {
  return <Outlet />;
}
