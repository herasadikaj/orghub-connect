export const AUTH_QUERY_KEYS = {
  all: ['auth'] as const,
  profile: () => [...AUTH_QUERY_KEYS.all, 'profile'] as const,
  user: (id: string) => [...AUTH_QUERY_KEYS.all, 'user', id] as const,
} as const;

export const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'Email and password are required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_CREDENTIALS: 'Invalid email or password',
  DUPLICATE_EMAIL: 'An account with this email already exists',
  WEAK_PASSWORD: 'Password must be at least 8 characters',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;
