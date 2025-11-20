import { apiClient } from '@/lib/axios';
import type { AuthResponse, User } from '../types';
import { mockAuthService } from './mockAuthService';

// Toggle between real API and mock data
// Set to true for development without backend, false for production
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

const realAuthService = {
  /**
   * Login user with email and password
   * POST /auth/login
   * Body: { email: string, password: string }
   * Response: { userId: number, email: string, token: string }
   */
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    return data;
  },

  /**
   * Register new user account
   * POST /auth/register
   * Body: { email: string, password: string, name?: string }
   * Response: { userId: number, email: string, token: string }
   */
  async signup(credentials: { email: string; password: string; name?: string }): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      '/auth/register',
      credentials
    );
    return data;
  },

  /**
   * Get current user profile
   * GET /api/profile
   * Requires: Authorization header with Bearer token
   * Response: { userId: number, email: string, name?: string }
   */
  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>('/api/profile');
    return data;
  },

  /**
   * Update user profile
   * PUT /api/profile
   * Requires: Authorization header with Bearer token
   * Body: { name?: string, email?: string }
   * Response: { userId: number, email: string, name?: string }
   */
  async updateProfile(updates: { name?: string; email?: string }): Promise<User> {
    const { data } = await apiClient.put<User>('/api/profile', updates);
    return data;
  },
};

// Export the appropriate service based on environment
export const authService = USE_MOCK_DATA ? mockAuthService : realAuthService;
