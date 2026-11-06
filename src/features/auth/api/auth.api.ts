import { apiClient } from '../../../shared/api/apiClient';
import type { AuthResponse, LoginRequest, RegisterRequest} from '@/features/auth/types';

const AUTH_API = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
};

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post(AUTH_API.LOGIN, data);
    return res.data;
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post(AUTH_API.REGISTER, data);
    return res.data;
  },
  refresh: async (): Promise<AuthResponse> => {
    const res = await apiClient.post(AUTH_API.REFRESH);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(AUTH_API.LOGOUT);
  },
};
