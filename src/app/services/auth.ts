import api from './api';
import { LoginCredentials, RegisterData, Admin, ApiResponse } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ admin: Admin; token: string }>> {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.data.admin));
    }
    return response.data;
  },

  async register(data: RegisterData): Promise<ApiResponse<{ admin: Admin; token: string }>> {
    const response = await api.post('/auth/register', data);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.data.admin));
    }
    return response.data;
  },

  async getCurrentAdmin(): Promise<ApiResponse<Admin>> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getAdmin(): Admin | null {
    const adminStr = localStorage.getItem('admin');
    return adminStr ? JSON.parse(adminStr) : null;
  },
};