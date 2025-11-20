import type { AuthResponse, User } from '@/features/auth/types';
import { mockCredentials, generateMockToken } from '@/mocks/authData';
import { mockProfiles } from '@/mocks/profileData';

/**
 * Mock Authentication Service
 * 
 * Simulates API responses using mock data for development without backend.
 * This service has the same interface as authService but returns mock data.
 * 
 * To use: Import mockAuthService instead of authService in development.
 */

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  /**
   * Mock login - validates against mock credentials
   */
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    await delay(); // Simulate network latency

    const credential = mockCredentials.find(
      cred => cred.email === credentials.email && cred.password === credentials.password
    );

    if (!credential) {
      throw {
        response: {
          status: 401,
          data: { message: 'Invalid email or password' }
        }
      };
    }

    return credential.response;
  },

  /**
   * Mock signup - creates new user with mock data
   */
  async signup(credentials: { email: string; password: string; name?: string }): Promise<AuthResponse> {
    await delay();

    // Check if email already exists
    const existingUser = mockCredentials.find(cred => cred.email === credentials.email);
    if (existingUser) {
      throw {
        response: {
          status: 409,
          data: { message: 'Email already exists' }
        }
      };
    }

    // Create new user
    const userId = Math.floor(Math.random() * 10000);
    const token = generateMockToken(userId, credentials.email);

    return {
      userId,
      email: credentials.email,
      token,
    };
  },

  /**
   * Mock get profile - returns user from mock data
   */
  async getProfile(): Promise<User> {
    await delay();

    // In real app, we'd decode the token to get userId
    // For mock, just return first profile with name if provided
    const profile = mockProfiles[0];
    
    return {
      ...profile,
      // Add some variation
      name: profile.name || 'Test User',
    };
  },

  /**
   * Mock update profile - simulates profile update
   */
  async updateProfile(updates: { name?: string; email?: string }): Promise<User> {
    await delay();

    const currentProfile = mockProfiles[0];

    // Check if email is taken (if changing email)
    if (updates.email && updates.email !== currentProfile.email) {
      const emailTaken = mockCredentials.some(cred => cred.email === updates.email);
      if (emailTaken) {
        throw {
          response: {
            status: 409,
            data: { message: 'Email already in use' }
          }
        };
      }
    }

    return {
      ...currentProfile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  },
};
