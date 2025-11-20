# Quickstart Guide: User Authentication System

**Feature**: User Authentication with REST API  
**Date**: November 20, 2025  
**Branch**: `001-user-auth`

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Project Structure](#project-structure)
4. [Environment Setup](#environment-setup)
5. [Development Workflow](#development-workflow)
6. [Usage Examples](#usage-examples)
7. [API Integration](#api-integration)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js 18+ and npm/bun installed
- Existing React + Vite project setup
- REST API backend with authentication endpoints (see [API Contracts](./contracts/))
- Basic understanding of React, TypeScript, and React Query

---

## Installation

### 1. Install Dependencies

Most dependencies should already exist. Install missing ones:

```bash
bun add axios zustand react-hook-form @hookform/resolvers zod @tanstack/react-query
```

### 2. Verify Existing Dependencies

Check `package.json` for:
- `react` (^18.0.0)
- `react-router-dom` (^6.0.0)
- `@tanstack/react-query` (^5.0.0)
- `zod` (^3.22.0)

---

## Project Structure

The authentication feature follows a feature-based architecture:

```
src/
├── features/
│   └── auth/
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   ├── SignupForm.tsx
│       │   ├── ProfileForm.tsx
│       │   ├── ProfileButton.tsx
│       │   └── AuthGuard.tsx
│       ├── hooks/
│       │   ├── useLogin.ts
│       │   ├── useSignup.ts
│       │   ├── useProfile.ts
│       │   ├── useUpdateProfile.ts
│       │   ├── useAuthGuard.ts
│       │   └── useLogout.ts
│       ├── services/
│       │   └── authService.ts
│       ├── types/
│       │   └── index.ts
│       ├── schemas/
│       │   ├── loginSchema.ts
│       │   ├── signupSchema.ts
│       │   └── profileSchema.ts
│       ├── store.ts
│       ├── constants.ts
│       └── index.ts
├── pages/
│   ├── Auth.tsx (Login)
│   ├── Signup.tsx
│   ├── Index.tsx (Home)
│   ├── Profile.tsx
│   └── LoginError.tsx
├── lib/
│   ├── axios.ts
│   └── utils.ts
└── constants/
    └── api.ts
```

---

## Environment Setup

### 1. Configure Axios Base URL

The base URL is intentionally set to empty string (relative paths):

**File**: `src/lib/axios.ts`

```typescript
import axios from 'axios';
import { useAuthStore } from '@/features/auth/store';

export const apiClient = axios.create({
  baseURL: '', // Empty string - API on same domain
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle auth errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      useAuthStore.getState().logout();
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);
```

### 2. Configure React Query

**File**: `src/main.tsx`

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

### 3. No Environment Variables Required

Since the base URL is empty, no `.env` configuration is needed. The API is assumed to be on the same domain as the frontend.

---

## Development Workflow

### Step 1: Create the Auth Store

**File**: `src/features/auth/store.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from './types';

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
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
      }),
    }
  )
);
```

### Step 2: Define Types and Schemas

**File**: `src/features/auth/types/index.ts`

```typescript
import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type User = z.infer<typeof userSchema>;

// Auth response schema
export const authResponseSchema = z.object({
  token: z.string().min(1),
  user: userSchema,
  expiresIn: z.number().optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
```

**File**: `src/features/auth/schemas/loginSchema.ts`

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

### Step 3: Create Auth Service

**File**: `src/features/auth/services/authService.ts`

```typescript
import { apiClient } from '@/lib/axios';
import type { AuthResponse, User, LoginInput } from '../types';

export const authService = {
  async login(credentials: LoginInput): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      '/api/auth/login',
      credentials
    );
    return data;
  },

  async signup(credentials: SignupInput): Promise<AuthResponse> {
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

  async updateProfile(updates: UpdateProfileInput): Promise<User> {
    const { data } = await apiClient.put<User>('/api/profile', updates);
    return data;
  },
};
```

### Step 4: Create Custom Hooks

**File**: `src/features/auth/hooks/useLogin.ts`

```typescript
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../store';
import type { LoginInput } from '../schemas/loginSchema';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate('/', { replace: true });
    },
    onError: () => {
      navigate('/login-error', { replace: true });
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
```

### Step 5: Create Components

**File**: `src/features/auth/components/LoginForm.tsx`

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '../hooks/useLogin';
import { loginSchema, type LoginInput } from '../schemas/loginSchema';

export function LoginForm() {
  const { login, isLoading, error } = useLogin();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(login)} className="space-y-4">
      {error && (
        <div className="text-red-600 text-sm">{error.message}</div>
      )}
      
      <div>
        <Input
          {...register('email')}
          type="email"
          placeholder="Email"
          disabled={isLoading}
        />
        {errors.email && (
          <span className="text-red-600 text-sm">{errors.email.message}</span>
        )}
      </div>

      <div>
        <Input
          {...register('password')}
          type="password"
          placeholder="Password"
          disabled={isLoading}
        />
        {errors.password && (
          <span className="text-red-600 text-sm">{errors.password.message}</span>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
```

### Step 6: Create Protected Routes

**File**: `src/features/auth/components/AuthGuard.tsx`

```typescript
import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

### Step 7: Configure Router

**File**: `src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthGuard } from '@/features/auth';
import Auth from '@/pages/Auth';
import Signup from '@/pages/Signup';
import Index from '@/pages/Index';
import Profile from '@/pages/Profile';
import LoginError from '@/pages/LoginError';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login-error" element={<LoginError />} />
        
        <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
        <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Usage Examples

### Login Flow

```typescript
// In Login page
import { LoginForm } from '@/features/auth';

export default function Auth() {
  return (
    <div className="container">
      <h1>Login</h1>
      <LoginForm />
      <a href="/signup">Don't have an account? Sign up</a>
    </div>
  );
}
```

### Signup Flow

```typescript
// In Signup page
import { SignupForm } from '@/features/auth';

export default function Signup() {
  return (
    <div className="container">
      <h1>Create Account</h1>
      <SignupForm />
      <a href="/auth">Already have an account? Login</a>
    </div>
  );
}
```

### Display User Info

```typescript
// In any component
import { useAuthStore } from '@/features/auth';

export function UserGreeting() {
  const user = useAuthStore((state) => state.user);
  
  return <p>Welcome, {user?.email}!</p>;
}
```

### Logout

```typescript
import { useLogout } from '@/features/auth/hooks/useLogout';

export function LogoutButton() {
  const { logout } = useLogout();
  
  return <Button onClick={logout}>Logout</Button>;
}
```

### Profile Page

```typescript
import { useProfile, ProfileForm } from '@/features/auth';

export default function Profile() {
  const { data: user, isLoading } = useProfile();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user?.email}</p>
      <p>Name: {user?.name || 'Not set'}</p>
      
      <h2>Edit Profile</h2>
      <ProfileForm />
    </div>
  );
}
```

---

## API Integration

### Expected API Endpoints

Ensure your backend implements these endpoints (see [contracts/](./contracts/) for full specs):

| Endpoint | Method | Auth Required | Purpose |
|----------|--------|---------------|---------|
| `/api/auth/login` | POST | No | Authenticate user |
| `/api/auth/signup` | POST | No | Create new account |
| `/api/profile` | GET | Yes (Bearer token) | Get user profile |
| `/api/profile` | PUT | Yes (Bearer token) | Update user profile |

### Authentication Header Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Error Response Format

```json
{
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS",
  "field": "email"
}
```

---

## Troubleshooting

### Issue: Token not persisting across page refreshes

**Solution**: Check that Zustand persist middleware is configured correctly:

```typescript
persist(
  (set) => ({ /* store */ }),
  { name: 'auth-storage' } // Must be present
)
```

### Issue: 401 errors not triggering logout

**Solution**: Verify Axios response interceptor is set up in `src/lib/axios.ts`:

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);
```

### Issue: Form validation not working

**Solution**: Ensure `@hookform/resolvers` is installed and zodResolver is imported:

```bash
bun add @hookform/resolvers
```

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
```

### Issue: Protected routes not redirecting

**Solution**: Wrap all protected routes with `<AuthGuard>`:

```typescript
<Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
```

### Issue: CORS errors

**Solution**: 
1. If API is on same domain: base URL should be empty string (already configured)
2. If API is on different domain: Configure CORS on backend to allow your frontend origin

### Issue: TypeScript errors on Zod schemas

**Solution**: Use `z.infer<typeof schema>` to generate types:

```typescript
export const loginSchema = z.object({ /* ... */ });
export type LoginInput = z.infer<typeof loginSchema>;
```

---

## Next Steps

After completing this setup:

1. ✅ Test login flow with valid credentials
2. ✅ Test signup flow with new account
3. ✅ Verify protected routes redirect unauthenticated users
4. ✅ Test profile viewing and editing
5. ✅ Test logout functionality
6. ✅ Test error scenarios (invalid credentials, validation errors)
7. ✅ Verify token persistence across page refreshes

---

## Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Axios Documentation](https://axios-http.com/)

---

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review [API Contracts](./contracts/) for endpoint specifications
3. Consult [Data Model](./data-model.md) for entity definitions
4. Refer to [Research](./research.md) for technical decisions

---

**Version**: 1.0.0  
**Last Updated**: November 20, 2025
