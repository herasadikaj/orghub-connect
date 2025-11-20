# Data Model: User Authentication System

**Date**: November 20, 2025  
**Feature**: User Authentication  
**Purpose**: Define all data entities, interfaces, and their relationships

---

## Overview

This data model defines the structure of data entities used in the authentication system. All interfaces follow TypeScript strict typing and are generated from Zod schemas where applicable.

---

## Core Entities

### User

Represents an authenticated user in the system.

**Properties**:
- `id`: Unique identifier for the user (UUID or numeric)
- `email`: User's email address (used as primary identifier)
- `name`: User's display name (optional for future expansion)
- `createdAt`: Timestamp when account was created (optional)
- `updatedAt`: Timestamp when profile was last updated (optional)

**Interface**:
```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

**Zod Schema**:
```typescript
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type User = z.infer<typeof userSchema>;
```

**Validation Rules**:
- Email must be valid format (contains @, domain)
- ID must be non-empty string
- Timestamps must be ISO 8601 format if provided

**State Transitions**: N/A (immutable after creation, except via update endpoint)

---

### AuthResponse

Represents the response from login or signup endpoints.

**Properties**:
- `token`: JWT token for authentication
- `user`: User object with profile information
- `expiresIn`: Token expiration time in seconds (optional)

**Interface**:
```typescript
interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: number;
}
```

**Zod Schema**:
```typescript
export const authResponseSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  user: userSchema,
  expiresIn: z.number().positive().optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
```

**Usage**:
- Returned by `/api/auth/login` endpoint
- Returned by `/api/auth/signup` endpoint
- Token stored in Zustand + localStorage
- User stored in Zustand for display

---

### LoginRequest

Represents the payload sent to the login endpoint.

**Properties**:
- `email`: User's email address
- `password`: User's password (plain text, encrypted over HTTPS)

**Interface**:
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Zod Schema**:
```typescript
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginRequest = z.infer<typeof loginSchema>;
```

**Validation Rules**:
- Email must be valid format
- Password minimum 8 characters
- Both fields required (no empty strings)

---

### SignupRequest

Represents the payload sent to the signup endpoint.

**Properties**:
- `email`: User's email address
- `password`: User's password
- `confirmPassword`: Password confirmation (optional, validated in form)
- `name`: User's display name (optional)

**Interface**:
```typescript
interface SignupRequest {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
}
```

**Zod Schema**:
```typescript
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
}).refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignupRequest = z.infer<typeof signupSchema>;
```

**Validation Rules**:
- Email must be valid format
- Password minimum 8 characters with complexity requirements
- Passwords must match if confirmPassword provided
- Name minimum 2 characters if provided

---

### UpdateProfileRequest

Represents the payload sent to update user profile.

**Properties**:
- `name`: Updated display name
- `email`: Updated email (optional, may require re-verification)

**Interface**:
```typescript
interface UpdateProfileRequest {
  name?: string;
  email?: string;
}
```

**Zod Schema**:
```typescript
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
}).refine((data) => data.name !== undefined || data.email !== undefined, {
  message: 'At least one field must be provided',
});

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
```

**Validation Rules**:
- At least one field must be provided
- Email must be valid format if provided
- Name minimum 2 characters if provided

---

### ErrorResponse

Represents error responses from API endpoints.

**Properties**:
- `message`: Human-readable error message
- `code`: Error code (optional, for programmatic handling)
- `field`: Field name if validation error (optional)

**Interface**:
```typescript
interface ErrorResponse {
  message: string;
  code?: string;
  field?: string;
}
```

**Zod Schema**:
```typescript
export const errorResponseSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  field: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
```

**Common Error Messages**:
- `"Invalid email or password"` - Login failed (FR-005)
- `"An account with this email already exists"` - Signup duplicate email
- `"Please enter a valid email address"` - Invalid email format
- `"Password must be at least 8 characters"` - Password too short
- `"Email and password are required"` - Empty fields (FR-007)

---

## State Management Entities

### AuthStore

Zustand store for authentication state.

**Properties**:
- `user`: Current authenticated user (null if not authenticated)
- `token`: JWT token (null if not authenticated)
- `isAuthenticated`: Boolean flag for quick auth checks
- `setAuth`: Action to set user and token
- `logout`: Action to clear authentication state

**Interface**:
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

interface AuthStore extends AuthState, AuthActions {}
```

**Implementation**:
```typescript
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      
      // Actions
      setAuth: (token, user) => 
        set({ token, user, isAuthenticated: true }),
      
      logout: () => 
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
      }),
    }
  )
);
```

**Persistence**:
- Token and user stored in localStorage under key `auth-storage`
- `isAuthenticated` derived from token existence on load
- Automatic rehydration on page load

---

## React Query Keys

Constants for React Query cache keys.

**Interface**:
```typescript
export const AUTH_QUERY_KEYS = {
  all: ['auth'] as const,
  profile: () => [...AUTH_QUERY_KEYS.all, 'profile'] as const,
  user: (id: string) => [...AUTH_QUERY_KEYS.all, 'user', id] as const,
} as const;
```

**Usage**:
- `AUTH_QUERY_KEYS.profile()` - User's own profile data
- `AUTH_QUERY_KEYS.all` - Invalidate all auth-related queries

---

## Entity Relationships

```
┌─────────────────┐
│   AuthStore     │
│  (Zustand)      │
│                 │
│ • token         │◄────── Stored in localStorage
│ • user          │
│ • isAuthenticated│
└────────┬────────┘
         │
         │ setAuth()
         │
         ▼
┌─────────────────┐
│  AuthResponse   │◄────── Returned from API
│                 │
│ • token         │
│ • user          │
│ • expiresIn     │
└─────────────────┘
         ▲
         │
         │
    ┌────┴─────┐
    │          │
┌───┴────┐ ┌──┴──────┐
│ Login  │ │ Signup  │
│Request │ │ Request │
└────────┘ └─────────┘

┌─────────────────┐
│   User          │◄────── Stored in AuthStore
│                 │◄────── Fetched via GET /api/profile
│ • id            │◄────── Updated via PUT /api/profile
│ • email         │
│ • name          │
└─────────────────┘
         ▲
         │
         │
┌────────┴────────┐
│ UpdateProfile   │
│ Request         │
└─────────────────┘
```

---

## Data Flow

### Login Flow
```
1. User submits LoginRequest → LoginForm
2. useLogin hook → authService.login()
3. Axios POST /api/auth/login with LoginRequest
4. API returns AuthResponse
5. useAuthStore.setAuth(token, user)
6. Token/user saved to localStorage
7. Navigate to home page
```

### Signup Flow
```
1. User submits SignupRequest → SignupForm
2. useSignup hook → authService.signup()
3. Axios POST /api/auth/signup with SignupRequest
4. API returns AuthResponse
5. useAuthStore.setAuth(token, user) (auto-login)
6. Token/user saved to localStorage
7. Navigate to home page
```

### Profile Load Flow
```
1. Component mounts → useProfile hook
2. React Query checks cache
3. If stale: authService.getProfile()
4. Axios GET /api/profile (token in header)
5. API returns User
6. React Query caches result
7. Component renders profile data
```

### Profile Update Flow
```
1. User submits UpdateProfileRequest → ProfileForm
2. useUpdateProfile hook → authService.updateProfile()
3. Optimistic update: React Query sets cache
4. Axios PUT /api/profile with UpdateProfileRequest
5. API returns updated User
6. React Query invalidates cache
7. Refetch profile data
8. Update AuthStore user if email changed
```

### Logout Flow
```
1. User clicks logout → useLogout hook
2. useAuthStore.logout()
3. Clear token/user from store and localStorage
4. React Query clear all caches
5. Navigate to login page
```

---

## Validation Summary

| Entity | Required Fields | Validation Rules | Error Messages |
|--------|----------------|------------------|----------------|
| **LoginRequest** | email, password | Email format, password min 8 chars | "Invalid email address", "Password must be at least 8 characters" |
| **SignupRequest** | email, password | Email format, password complexity, passwords match | "Invalid email address", "Password must contain...", "Passwords do not match" |
| **UpdateProfileRequest** | At least one | Email format if provided, name min 2 chars | "Invalid email address", "Name must be at least 2 characters" |
| **User** | id, email | Email format, non-empty id | "Invalid email address" |
| **AuthResponse** | token, user | Non-empty token, valid user object | "Token is required" |

---

## Type Export Structure

All types exported from feature index:

```typescript
// src/features/auth/types/index.ts
export type {
  User,
  AuthResponse,
  LoginRequest,
  SignupRequest,
  UpdateProfileRequest,
  ErrorResponse,
  AuthStore,
  AuthState,
  AuthActions,
} from './schemas';

export { AUTH_QUERY_KEYS } from '../constants';
```

---

## Notes

1. **Passwords**: Never stored or logged on client side. Sent over HTTPS only.
2. **Token Format**: Assumed JWT but treated as opaque string on client.
3. **Timestamps**: ISO 8601 format (e.g., `2025-11-20T10:30:00Z`).
4. **Email Uniqueness**: Enforced by backend, client shows error from API.
5. **Optional Fields**: Name and timestamps optional to allow minimal MVP.
6. **Type Safety**: All types generated from Zod schemas using `z.infer`.
7. **Immutability**: Entities are immutable, updates create new instances.
8. **Null vs Undefined**: Use `null` for explicitly empty values, `undefined` for optional fields.

---

## Future Expansions (Not Implemented - YAGNI)

These fields/entities are NOT part of the current implementation but documented for potential future needs:

- `User.avatarUrl`: Profile picture
- `User.role`: User roles (admin, user, etc.)
- `User.lastLoginAt`: Last login timestamp
- `RefreshTokenRequest`: For token refresh flow
- `ResetPasswordRequest`: For password reset
- `EmailVerification`: For email verification flow
- `TwoFactorAuth`: For 2FA
- `UserPreferences`: Theme, language settings

Only implement these if explicitly required by future feature specifications.
