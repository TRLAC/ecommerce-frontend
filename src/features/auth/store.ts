import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/features/auth/types";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isInitialized: boolean;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setInitialized: (v: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isInitialized: false,
 
      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
      setInitialized: (v) => set({ isInitialized: v }),
      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "auth-storage", // key trong localStorage
      // accessToken không lưu localStorage (lấy lại bằng refresh cookie khi mở app)
      partialize: (state) => ({ user: state.user }),
    }
  )
);