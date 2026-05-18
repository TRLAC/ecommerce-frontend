import { Outlet, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function MainLayout() {
  const { logout } = useAuth();

  return (
    <div>
      <header style={{ padding: 20, borderBottom: "1px solid #ccc" }}>
        <Link to="/">Products</Link> |{" "}
        <Link to="/cart">Cart</Link> |{" "}
        <Link to="/orders">Orders</Link> |{" "}
        <Link to="/profile">Profile</Link> |{" "}
        <button onClick={logout}>Logout</button>
      </header>

      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}