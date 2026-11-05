import { apiClient } from './apiClient';
import { CONFIG } from '@/constants/config';
import { AdminUser, LoginCredentials } from '@/types/auth.types';
import { ApiResponse } from '@/types/api.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AdminUser>> => {
    return (await apiClient.post(
      CONFIG.API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )) as unknown as ApiResponse<AdminUser>;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return (await apiClient.post(
      CONFIG.API_ENDPOINTS.AUTH.LOGOUT
    )) as unknown as ApiResponse<null>;
  },

  getMe: async (): Promise<ApiResponse<AdminUser>> => {
    return (await apiClient.get(
      CONFIG.API_ENDPOINTS.AUTH.ME
    )) as unknown as ApiResponse<AdminUser>;
  },
};

