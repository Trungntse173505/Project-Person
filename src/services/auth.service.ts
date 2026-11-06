import { apiClient } from './apiClient';
import { CONFIG } from '@/constants/config';
import { AdminUser, LoginCredentials } from '@/types/auth.types';
import { ApiResponse } from '@/types/api.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AdminUser>> => {
    const res = (await apiClient.post(
      CONFIG.API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )) as unknown as ApiResponse<AdminUser>;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('admin_session', '1');
      } catch {
        // Bỏ qua lỗi nếu localStorage bị chặn
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
        } catch {
          // Bỏ qua lỗi
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
