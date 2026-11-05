export interface AdminUser {
  id: number;
  username: string;
  created_at?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: AdminUser;
}

