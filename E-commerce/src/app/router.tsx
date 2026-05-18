import { createBrowserRouter } from 'react-router-dom'
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";

import ProtectedRoute from "@/app/ProtectedRoute";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
// import RegisterPage from "@/features/auth/pages/RegisterPage";

import DashboardPage from "@/features/Dashboard/pages/dashboardPage";
import ProfilePage from "@/features/Profile/pages/ProfilePage";
import ProductListPage from "@/features/Product/pages/ProductListPage";


export const router = createBrowserRouter([
    // 🔓 auth
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

    // 🔐 protected
  {
    element: <ProtectedRoute  allowedRoles={["ROLE_USER", "ROLE_ADMIN"]} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <ProductListPage /> },
        //   { path: "/products/:id", element: <ProductDetailPage /> },
        //   { path: "/cart", element: <CartPage /> },
        //   { path: "/checkout", element: <CheckoutPage /> },
        //   { path: "/orders", element: <OrderHistoryPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "*", element: <div>404 Not Found</div> },
        ],
      },
    ],
  },

  {
  element: <ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { path: "/admin", element: <DashboardPage /> },
         { path: "/admin/profile", element: <ProfilePage /> },
      ],
    },
  ],
}

]);