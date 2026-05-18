import { useAuthStore } from "../store";
import { authApi } from "../api/auth.api";

export const useAuth = () => {
  const { setAccessToken, setUser, logout } = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login({ email, password });

      setAccessToken(data.accessToken);
      setUser(data.user);

      return data.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    try {
      const data = await authApi.register({ fullName, email, password });

      setAccessToken(data.accessToken);
      setUser(data.user);
      
      return data.user;
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout(); // 👈 luôn logout kể cả API fail
    }
  };

  return {
    login,
    register,
    logout: handleLogout,
  };
};

