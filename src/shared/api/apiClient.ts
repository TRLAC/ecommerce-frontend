import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/features/auth/store";

// .env: VITE_API_URL=http://localhost:8080/api
const BASE_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

export const apiClient = axios.create({ baseURL: BASE_URL, withCredentials: true });

// client riêng (không interceptor) để gọi refresh, tránh lặp vô hạn
const refreshClient = axios.create({ baseURL: BASE_URL, withCredentials: true });

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };
type Waiter = { resolve: (token: string) => void; reject: (err: unknown) => void };

let isRefreshing = false;
let queue: Waiter[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  queue.forEach((p) => (error || !token ? p.reject(error) : p.resolve(token)));
  queue = [];
};

// các endpoint auth tự xử lý 401 (sai mật khẩu, hết hạn refresh), không thử refresh lại
const isAuthUrl = (url?: string) => !!url && /\/auth\/(login|register|refresh|logout)/.test(url);

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;

    if (!original || error.response?.status !== 401 || original._retry || isAuthUrl(original.url)) {
      return Promise.reject(error);
    }
    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(original));
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    try {
      const res = await refreshClient.post("/auth/refresh");
      const { accessToken, user } = res.data;

      useAuthStore.getState().setAccessToken(accessToken);
      useAuthStore.getState().setUser(user);
      processQueue(null, accessToken);

      original.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(original);
    } catch (err) {
      processQueue(err, null);
      useAuthStore.getState().logout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
