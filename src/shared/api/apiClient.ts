import axios from "axios";
import { useAuthStore } from "@/features/auth/store";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let queue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;  // ✅ fix 1: thêm reject
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  queue = [];
};

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject,  // ✅ fix 1: reject được gọi khi refresh thất bại
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await refreshClient.post("/auth/refresh");
      const { accessToken, user } = res.data;

      useAuthStore.getState().setAccessToken(accessToken);
      useAuthStore.getState().setUser(user);       // ✅ fix 3: sync user

      processQueue(null, accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (err) {
      processQueue(err, null);                     // ✅ fix 1: reject toàn bộ queue
      useAuthStore.getState().logout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;