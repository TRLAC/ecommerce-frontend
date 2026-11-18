import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";

import ProtectedRoute from "@/app/ProtectedRoute";
import GuestRoute from "@/app/GuestRoute";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";

import AdminProductsPage from "@/features/Admin/pages/AdminProductsPage";
import AdminCategoriesPage from "@/features/Admin/pages/AdminCategoriesPage";
import AdminDashboardPage from "@/features/Admin/pages/AdminDashboardPage";
import AdminOrdersPage from "@/features/Admin/pages/AdminOrdersPage";
import AdminOrderDetailPage from "@/features/Admin/pages/AdminOrderDetailPage";
import AdminRefundsPage from "@/features/Admin/pages/AdminRefundsPage";
import AdminUsersPage from "@/features/Admin/pages/AdminUsersPage";
import ProfilePage from "@/features/Profile/pages/ProfilePage";
import ProductListPage from "@/features/Product/pages/ProductListPage";
import ProductDetailPage from "@/features/Product/pages/ProductDetailPage";
import CartPage from "@/features/Cart/pages/CartPage";

// Checkout
import { CheckoutPage } from "@/features/Checkout/pages/CheckoutPage";

// Order
import { OrderHistoryPage } from "@/features/Order/pages/OrderHistoryPage";
import { OrderDetailPage } from "@/features/Order/pages/OrderDetailPage";
import { OrderSuccessPage } from "@/features/Order/pages/OrderSuccessPage";

// Payment
import { PaymentGatewayPage } from "@/features/Payment/pages/PaymentGatewayPage";
import { PaymentSuccessPage } from "@/features/Payment/pages/PaymentSuccessPage";
import { PaymentFailedPage } from "@/features/Payment/pages/PaymentFailedPage";

import NotFoundPage from "@/pages/NotFoundPage";
import ForbiddenPage from "@/pages/ForbiddenPage";

export const router = createBrowserRouter([
  // 🔓 Auth (chỉ cho khách)
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
        ],
      },
    ],
  },

  { path: "/403", element: <ForbiddenPage /> },

  // 🌐 Storefront: sản phẩm công khai, phần còn lại cần đăng nhập
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <ProductListPage /> },
      { path: "/products/:id", element: <ProductDetailPage /> },

      {
        element: <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]} />,
        children: [
          { path: "/cart", element: <CartPage /> },
          { path: "/checkout", element: <CheckoutPage /> },

          { path: "/orders", element: <OrderHistoryPage /> },
          { path: "/orders/:id", element: <OrderDetailPage /> },
          { path: "/orders/success/:id", element: <OrderSuccessPage /> },

          { path: "/payment/gateway", element: <PaymentGatewayPage /> },
          { path: "/payment/success", element: <PaymentSuccessPage /> },
          { path: "/payment/failed", element: <PaymentFailedPage /> },

          { path: "/profile", element: <ProfilePage /> },
        ],
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },

  // 🔐 Protected (ADMIN only)
  {
    element: <ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin", element: <AdminDashboardPage /> },
          { path: "/admin/orders", element: <AdminOrdersPage /> },
          { path: "/admin/orders/:id", element: <AdminOrderDetailPage /> },
          { path: "/admin/refunds", element: <AdminRefundsPage /> },
          { path: "/admin/users", element: <AdminUsersPage /> },
          { path: "/admin/profile", element: <ProfilePage /> },
          { path: "/admin/*", element: <NotFoundPage homeHref="/admin" /> },
          { path: "/admin/products", element: <AdminProductsPage /> },
          { path: "/admin/categories", element: <AdminCategoriesPage /> },
        ],
      },
    ],
  },
]);
