import { createBrowserRouter } from 'react-router-dom'
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";

import ProtectedRoute from "@/app/ProtectedRoute";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";

import DashboardPage from "@/features/Dashboard/pages/dashboardPage";
import ProfilePage from "@/features/Profile/pages/ProfilePage";
import ProductListPage from "@/features/Product/pages/ProductListPage";
import ProductDetailPage from "@/features/Product/pages/ProductDetailPage";
import CartPage from '@/features/Cart/pages/CartPage';

// Checkout
import { CheckoutPage } from '@/features/Checkout/pages/CheckoutPage';

// Order
import { OrderHistoryPage } from '@/features/Order/pages/OrderHistoryPage';
import { OrderDetailPage } from '@/features/Order/pages/OrderDetailPage';
import { OrderSuccessPage } from '@/features/Order/pages/OrderSuccessPage';

// Payment
import { PaymentSuccessPage } from '@/features/Payment/pages/PaymentSuccessPage';
import { PaymentFailedPage } from '@/features/Payment/pages/PaymentFailedPage';


export const router = createBrowserRouter([
  // 🔓 Auth
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  // 🔐 Protected (USER + ADMIN)
  {
    element: <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          // Product
          { path: "/", element: <ProductListPage /> },
          { path: "/products/:id", element: <ProductDetailPage /> },

          // Cart
          { path: "/cart", element: <CartPage /> },

          // Checkout (frontend-only, orchestrates Order + Payment)
          { path: "/checkout", element: <CheckoutPage /> },

          // Orders
          { path: "/orders", element: <OrderHistoryPage /> },
          { path: "/orders/:id", element: <OrderDetailPage /> },
          { path: "/orders/success/:id", element: <OrderSuccessPage /> },

          // Payment callbacks (redirect từ VNPay / MoMo)
          { path: "/payment/success", element: <PaymentSuccessPage /> },
          { path: "/payment/failed", element: <PaymentFailedPage /> },

          // Profile
          { path: "/profile", element: <ProfilePage /> },

          { path: "*", element: <div>404 Not Found</div> },
        ],
      },
    ],
  },

  // 🔐 Protected (ADMIN only)
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
  },
]);
