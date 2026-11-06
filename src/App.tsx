import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store";


function App() {
  const { setAccessToken, setUser, setInitialized, logout, isInitialized } =  useAuthStore();

  useEffect(() => {
    const initiate = async () => {
      try {
        const data = await authApi.refresh();

        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch (error) {
        logout();
      } finally {
        setInitialized(true);
      }
    };

    initiate();
  }, []);

    if (!isInitialized) return <div>Loading...</div>;
  
  return <RouterProvider router={router} />;
}

export default App;