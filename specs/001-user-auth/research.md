# Research: User Authentication System

**Date**: November 20, 2025  
**Feature**: User Authentication with REST API  
**Purpose**: Research technical decisions for implementing JWT-based authentication with Axios, Zustand, and React Hook Form

---

## Research Questions & Decisions

### 1. REST API Authentication Pattern

**Question**: How should we structure REST API authentication with JWT tokens in a React application?

**Decision**: Use JWT Bearer token authentication with Axios interceptors

**Rationale**:
- JWT tokens are stateless and scalable
- Axios interceptors automatically attach tokens to requests
- Industry-standard pattern used by most REST APIs
- Tokens stored in both Zustand (runtime) and localStorage (persistence)

**Alternatives Considered**:
- Session-based cookies: Requires backend session management, less scalable
- OAuth2: Over-engineered for simple email/password auth
- Basic Auth: Insecure, sends credentials with every request

**Implementation Pattern**:
```typescript
// Axios interceptor adds token to all requests
axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses (expired/invalid tokens)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      router.navigate('/auth');
    }
    return Promise.reject(error);
  }
);
```

---

### 2. Token Storage Strategy

**Question**: Where should JWT tokens be stored for security and persistence?

**Decision**: Zustand store + localStorage synchronization

**Rationale**:
- Zustand provides reactive state updates across components
- localStorage ensures tokens persist across browser refreshes
- Simpler than cookies (no backend configuration needed)
- Meets requirement: "Token stored in Zustand + localStorage"

**Alternatives Considered**:
- httpOnly cookies: More secure but requires backend cookie handling
- sessionStorage: Loses data when user opens new tab
- Memory only: Loses authentication on page refresh

**Security Considerations**:
- localStorage vulnerable to XSS attacks
- Mitigated by: Content Security Policy, input sanitization, HTTPS
- Acceptable trade-off for user convenience

**Implementation Pattern**:
```typescript
// Zustand store with localStorage middleware
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialStorage: (state) => ({ token: state.token }), // Only persist token
    }
  )
);
```

---

### 3. React Query Integration with REST APIs

**Question**: How should React Query work with Axios for data fetching?

**Decision**: Use React Query with Axios as the fetching mechanism

**Rationale**:
- React Query handles caching, refetching, loading states
- Axios provides request/response interceptors for auth tokens
- Separates concerns: Axios for HTTP, React Query for state management
- Follows "ReadQuery pattern" requirement

**Alternatives Considered**:
- Fetch API: No interceptors, manual error handling
- SWR: Similar to React Query but less feature-rich
- Axios alone: No automatic caching or refetching

**Implementation Pattern**:
```typescript
// React Query hook with Axios
export function useProfile() {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => authService.getProfile(),
    enabled: useAuthStore((state) => state.isAuthenticated),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Axios service function
export const authService = {
  getProfile: async (): Promise<User> => {
    const { data } = await axios.get('/api/profile');
    return data;
  },
};
```

---

### 4. Form Validation with React Hook Form + Zod

**Question**: How should form validation work with React Hook Form and Zod schemas?

**Decision**: Use zodResolver to integrate Zod schemas with React Hook Form

**Rationale**:
- Zod provides type-safe schema validation (constitution requirement)
- React Hook Form handles form state and submission
- zodResolver bridges the two libraries seamlessly
- Reduces boilerplate compared to manual validation

**Alternatives Considered**:
- Manual validation: Repetitive, error-prone
- Yup: Less type-safe than Zod with TypeScript
- Built-in HTML5 validation: Limited, not customizable

**Implementation Pattern**:
```typescript
// Zod schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginInput = z.infer<typeof loginSchema>;

// React Hook Form with zodResolver
function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    // data is fully typed and validated
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

---

### 5. Protected Routes Pattern

**Question**: How should we prevent unauthenticated access to protected pages?

**Decision**: Custom `AuthGuard` component + `useAuthGuard` hook

**Rationale**:
- Declarative approach: wrap protected pages with `<AuthGuard>`
- Centralized logic in one reusable component
- Automatic redirect to login page
- Follows React patterns (composition over HOCs)

**Alternatives Considered**:
- Route-level guards in React Router: More configuration
- Higher-Order Components: Deprecated pattern
- Manual checks in each page: Violates DRY

**Implementation Pattern**:
```typescript
// AuthGuard component
export function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // or loading spinner
  }

  return <>{children}</>;
}

// Usage in router
<Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
<Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
```

---

### 6. Error Handling Strategy

**Question**: How should API errors be handled and displayed to users?

**Decision**: Service layer throws errors, hooks catch and expose them, components display them

**Rationale**:
- Clear separation of concerns
- Hooks expose error state from React Query
- Components decide how to render errors
- Consistent error handling across all features

**Alternatives Considered**:
- Global error boundary: Too broad, loses context
- Toast notifications: Adds complexity, not required
- Error codes: Unnecessary for simple auth flow

**Implementation Pattern**:
```typescript
// Service throws errors
export const authService = {
  login: async (credentials: LoginInput): Promise<AuthResponse> => {
    try {
      const { data } = await axios.post('/api/auth/login', credentials);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw error;
    }
  },
};

// Hook exposes error
export function useLogin() {
  const mutation = useMutation({
    mutationFn: authService.login,
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

// Component displays error
function LoginForm() {
  const { login, isLoading, error } = useLogin();
  
  return (
    <form>
      {error && <Alert variant="destructive">{error.message}</Alert>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
```

---

### 7. Navigation Flow After Authentication

**Question**: How should navigation work after successful login/signup?

**Decision**: Use React Router's `useNavigate` with `replace: true` option

**Rationale**:
- `replace: true` prevents back button from returning to auth pages
- Programmatic navigation after async operations
- Centralized in mutation success callbacks
- Matches requirement: "All navigation flows"

**Alternatives Considered**:
- `window.location.href`: Full page reload, loses state
- `<Navigate>` component: Works only for declarative navigation
- History API: Lower-level, more complex

**Implementation Pattern**:
```typescript
export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate('/', { replace: true }); // Go to home, can't go back to login
    },
    onError: (error) => {
      navigate('/login-error', { replace: true }); // Go to error page
    },
  });

  return { login: mutation.mutate, isLoading: mutation.isPending };
}
```

---

### 8. API Base URL Configuration

**Question**: How should the API base URL be configured?

**Decision**: Use empty string as base URL (relative paths)

**Rationale**:
- User requirement: "base url leave it as empty string"
- API hosted on same domain as frontend
- Simplifies deployment (no CORS issues)
- Relative paths work in all environments

**Alternatives Considered**:
- Environment variables: Adds complexity
- Absolute URLs: Requires CORS configuration
- Proxy in development: Vite already handles this

**Implementation Pattern**:
```typescript
// lib/axios.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '', // Empty string as requested
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Usage in services
export const authService = {
  login: async (credentials: LoginInput) => {
    const { data } = await apiClient.post('/api/auth/login', credentials);
    return data;
  },
};
```

---

### 9. Profile Editing Implementation

**Question**: How should profile editing work with form management?

**Decision**: Separate `ProfileForm` component with React Hook Form + optimistic updates

**Rationale**:
- User requirement: "Editable profile"
- React Hook Form handles edit state
- React Query mutation for PUT request
- Optimistic UI updates for better UX

**Alternatives Considered**:
- Edit mode toggle: More complex state management
- Separate edit page: Extra navigation, worse UX
- Inline editing: Harder to validate

**Implementation Pattern**:
```typescript
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateProfile,
    onMutate: async (newProfile) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['auth', 'profile'] });
      const previous = queryClient.getQueryData(['auth', 'profile']);
      queryClient.setQueryData(['auth', 'profile'], newProfile);
      return { previous };
    },
    onError: (err, newProfile, context) => {
      // Rollback on error
      queryClient.setQueryData(['auth', 'profile'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
    },
  });
}
```

---

### 10. Loading State Management

**Question**: How should loading states be displayed during authentication?

**Decision**: Use React Query's built-in loading states + disabled form inputs

**Rationale**:
- React Query provides `isPending`, `isLoading`, `isSuccess`
- Disable form inputs during submission (prevents duplicate requests)
- Show loading text on submit button
- Meets requirement: "Form submission while request is in progress"

**Alternatives Considered**:
- Global loading overlay: Blocks entire UI
- Separate loading component: More code
- No loading state: Poor UX

**Implementation Pattern**:
```typescript
function LoginForm() {
  const { login, isLoading } = useLogin();
  const { register, handleSubmit } = useForm<LoginInput>();

  return (
    <form onSubmit={handleSubmit(login)}>
      <input {...register('email')} disabled={isLoading} />
      <input {...register('password')} disabled={isLoading} />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          'Login'
        )}
      </Button>
    </form>
  );
}
```

---

## Summary of Technical Decisions

| Area | Technology/Pattern | Rationale |
|------|-------------------|-----------|
| **HTTP Client** | Axios with interceptors | Request/response interceptors for tokens, better error handling |
| **State Management** | Zustand with persist middleware | Simple, reactive, localStorage sync |
| **Server State** | React Query (TanStack Query) | Caching, refetching, loading states |
| **Form Management** | React Hook Form + zodResolver | Type-safe validation, minimal re-renders |
| **Schema Validation** | Zod schemas | TypeScript integration, runtime validation |
| **Protected Routes** | AuthGuard component + hook | Declarative, reusable, follows React patterns |
| **Token Storage** | Zustand + localStorage | Reactive + persistent |
| **Error Handling** | Service throws, hooks expose, components display | Clear separation of concerns |
| **Navigation** | React Router useNavigate | Programmatic with replace option |
| **API Base URL** | Empty string (relative paths) | User requirement, same-domain hosting |
| **Profile Editing** | React Hook Form + optimistic updates | Better UX, automatic rollback on error |
| **Loading States** | React Query + disabled inputs | Built-in, prevents duplicate submissions |

---

## Dependencies to Install

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "@tanstack/react-query": "^5.10.0",
    "react-router-dom": "^6.20.0"
  }
}
```

**Note**: Most dependencies already exist in the project. May need to add `@hookform/resolvers` if not present.

---

## Best Practices from Research

1. **Single Axios Instance**: Create one configured instance in `lib/axios.ts`
2. **Token Refresh**: Not implemented initially (YAGNI), add only if backend supports it
3. **Type Safety**: Generate types from Zod schemas using `z.infer`
4. **Error Messages**: Use descriptive, user-friendly messages from API responses
5. **Query Keys**: Use constants for all React Query keys (in `constants.ts`)
6. **Optimistic Updates**: Use for profile editing to improve perceived performance
7. **Form Reset**: Reset forms after successful submission
8. **Redirect Handling**: Use `replace: true` to prevent back-button confusion
9. **Token Expiry**: Handle 401 responses globally in Axios interceptor
10. **Password Visibility**: Add toggle for password fields (UX best practice)

---

## Open Questions (None - All Resolved)

All technical questions have been researched and decided. Ready to proceed to Phase 1 (Data Model).
