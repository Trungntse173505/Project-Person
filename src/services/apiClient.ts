import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { CONFIG } from '@/constants/config';

export const apiClient: AxiosInstance = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: CONFIG.TIMEOUT,
  withCredentials: true, // Gửi và nhận HttpOnly Cookie tự động
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ success?: boolean; message?: string }>) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Lỗi kết nối tới máy chủ Backend.';
    return Promise.reject(new Error(message));
  }
);

