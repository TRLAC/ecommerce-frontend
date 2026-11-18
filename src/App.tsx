import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store";
import PageLoader from "@/shared/components/PageLoader";
import Toaster from "@/shared/components/Toaster";

// StrictMode (dev) chạy effect 2 lần. BE xoay (revoke) refresh token sau mỗi lần dùng,
// nên chỉ được gọi refresh MỘT lần cho cả hai lần chạy, nếu không lần 2 sẽ bị 401 và user bị đăng xuất.
let refreshPromise: ReturnType<typeof authApi.refresh> | null = null;
const refreshOnce = () => {
  refreshPromise ??= authApi.refresh().finally(() => {
    setTimeout(() => (refreshPromise = null), 0);
  });
  return refreshPromise;
};

function App() {
  const { setAccessToken, setUser, setInitialized, logout, isInitialized } = useAuthStore();

  useEffect(() => {
    const initiate = async () => {
      try {
        const data = await refreshOnce();
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        logout();
      } finally {
        setInitialized(true);
      }
    };

    initiate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isInitialized) return <PageLoader />;

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
