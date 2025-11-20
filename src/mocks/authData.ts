import type { AuthResponse } from '@/features/auth/types';

/**
 * Mock authentication responses for development and testing
 */

export const mockAuthResponses: AuthResponse[] = [
  {
    userId: 1,
    email: 'john.doe@example.com',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTcwMDQ4MzIwMCwiZXhwIjoxNzAwNTY5NjAwfQ.mock_token_1',
  },
  {
    userId: 2,
    email: 'jane.smith@example.com',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZW1haWwiOiJqYW5lLnNtaXRoQGV4YW1wbGUuY29tIiwiaWF0IjoxNzAwNDgzMjAwLCJleHAiOjE3MDA1Njk2MDB9.mock_token_2',
  },
  {
    userId: 3,
    email: 'michael.johnson@example.com',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJtaWNoYWVsLmpvaG5zb25AZXhhbXBsZS5jb20iLCJpYXQiOjE3MDA0ODMyMDAsImV4cCI6MTcwMDU2OTYwMH0.mock_token_3',
  },
  {
    userId: 4,
    email: 'sarah.williams@example.com',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwiZW1haWwiOiJzYXJhaC53aWxsaWFtc0BleGFtcGxlLmNvbSIsImlhdCI6MTcwMDQ4MzIwMCwiZXhwIjoxNzAwNTY5NjAwfQ.mock_token_4',
  },
  {
    userId: 5,
    email: 'david.brown@example.com',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1IiwiZW1haWwiOiJkYXZpZC5icm93bkBleGFtcGxlLmNvbSIsImlhdCI6MTcwMDQ4MzIwMCwiZXhwIjoxNzAwNTY5NjAwfQ.mock_token_5',
  },
];

/**
 * Default test auth response
 */
export const defaultTestAuthResponse: AuthResponse = mockAuthResponses[0];

/**
 * Mock credentials for testing login
 */
export const mockCredentials = [
  {
    email: 'o.merxira@teamsystem.com',
    password: 'Pa$$w0rd',
    response: {
      userId: 100,
      email: 'o.merxira@teamsystem.com',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDAiLCJlbWFpbCI6Im8ubWVyeGlyYUB0ZWFtc3lzdGVtLmNvbSIsImlhdCI6MTcwMDQ4MzIwMCwiZXhwIjoxNzAwNTY5NjAwfQ.mock_token_merxira',
    },
  },
  {
    email: 'john.doe@example.com',
    password: 'Password123',
    response: mockAuthResponses[0],
  },
  {
    email: 'jane.smith@example.com',
    password: 'securePass456',
    response: mockAuthResponses[1],
  },
  {
    email: 'michael.johnson@example.com',
    password: 'test1234',
    response: mockAuthResponses[2],
  },
  {
    email: 'sarah.williams@example.com',
    password: 'myPassword789',
    response: mockAuthResponses[3],
  },
  {
    email: 'david.brown@example.com',
    password: 'brownD2024!',
    response: mockAuthResponses[4],
  },
  
];

/**
 * Get mock auth response by email
 */
export const getMockAuthByEmail = (email: string): AuthResponse | undefined => {
  const credential = mockCredentials.find(cred => cred.email === email);
  return credential?.response;
};

/**
 * Validate mock credentials (for testing)
 */
export const validateMockCredentials = (email: string, password: string): AuthResponse | null => {
  const credential = mockCredentials.find(
    cred => cred.email === email && cred.password === password
  );
  return credential?.response || null;
};

/**
 * Generate a mock JWT token for testing
 */
export const generateMockToken = (userId: number, email: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: userId.toString(),
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
  }));
  const signature = 'mock_signature_' + Math.random().toString(36).substring(7);
  
  return `${header}.${payload}.${signature}`;
};
