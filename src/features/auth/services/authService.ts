import { apiClient } from '@/lib/axios';
import type { AuthResponse, User } from '../types';

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      '/api/auth/login',
      credentials
    );
    return data;
  },

  async signup(credentials: { email: string; password: string; name?: string }): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      '/api/auth/signup',
      credentials
    );
    return data;
  },

  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>('/api/profile');
    return data;
  },

  async updateProfile(updates: { name?: string; email?: string }): Promise<User> {
    const { data } = await apiClient.put<User>('/api/profile', updates);
    return data;
  },
};
