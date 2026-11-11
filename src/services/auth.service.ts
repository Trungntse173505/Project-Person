import { apiClient } from './apiClient';
import { CONFIG } from '@/constants/config';
import { AdminUser, LoginCredentials } from '@/types/auth.types';
import { ApiResponse } from '@/types/api.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AdminUser>> => {
    const res = (await apiClient.post(
      CONFIG.API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )) as unknown as ApiResponse<AdminUser & { token?: string }>;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('admin_session', '1');
        if (res.data?.token) {
          localStorage.setItem('admin_token', res.data.token);
        }
      } catch {
      }
    }

    return res;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    try {
      return (await apiClient.post(
        CONFIG.API_ENDPOINTS.AUTH.LOGOUT
      )) as unknown as ApiResponse<null>;
    } finally {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('admin_session');
          localStorage.removeItem('admin_token');
        } catch {
        }
      }
    }
  },

  getMe: async (): Promise<ApiResponse<AdminUser>> => {
    return (await apiClient.get(
      CONFIG.API_ENDPOINTS.AUTH.ME
    )) as unknown as ApiResponse<AdminUser>;
  },
};
