# OrgHub Connect - Project Constitution

## Core Principles

### YAGNI (You Aren't Gonna Need It)
- Only implement features that are needed right now
- Avoid speculative generalization
- Remove unused code immediately
- Don't add functionality until it's actually required

### KISS (Keep It Simple, Stupid)
- Favor simple solutions over complex ones
- Write code that is easy to read and understand
- Avoid over-engineering
- Choose clarity over cleverness

### DRY (Don't Repeat Yourself)
- Extract reusable logic into shared utilities
- Create custom hooks for repeated UI logic
- Use constants for values used multiple times
- Centralize configuration and type definitions

## Technology Stack

### Core Technologies
- **Language**: TypeScript (strict mode enabled)
- **Framework**: React with Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase

### Required Libraries
- **Data Fetching**: React Query (TanStack Query)
- **State Management**: Zustand
- **Schema Validation**: Zod
- **UI Components**: shadcn/ui

## Architecture Patterns

### Feature-Based Architecture
```
src/
  features/
    [feature-name]/
      components/          # Feature-specific components
      hooks/              # Feature-specific hooks
      services/           # API calls and business logic
      types/              # Feature-specific types and interfaces
      constants.ts        # Feature-specific constants
      index.ts            # Public API exports
```

### File Organization
- Group by feature, not by technical type
- Each feature is self-contained and modular
- Shared utilities in `src/lib/`
- Shared components in `src/components/ui/`
- Global types in `src/types/`
- Global constants in `src/constants/`

## Code Standards

### TypeScript Guidelines

#### Always Use Interfaces
```typescript
// ✅ DO: Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ DON'T: Use type aliases for object shapes
type User = {
  id: string;
  name: string;
};
```

#### Strict Type Safety
- Enable strict mode in `tsconfig.json`
- No `any` types (use `unknown` if needed)
- Explicit return types for functions
- Use generics for reusable code

```typescript
// ✅ DO: Explicit types
interface ApiResponse<T> {
  data: T;
  error: string | null;
}

function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  // implementation
}

// ❌ DON'T: Implicit any
function fetchData(url) {
  // implementation
}
```

### React Patterns

#### Hooks Pattern
- Use custom hooks for all reusable logic
- Prefix all hooks with `use`
- Keep hooks focused and single-purpose
- Extract complex logic from components

```typescript
// ✅ DO: Custom hooks for logic
interface UseUserDataReturn {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

function useUserData(userId: string): UseUserDataReturn {
  // React Query implementation
}

// ❌ DON'T: Logic in components
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // fetching logic
  }, [userId]);
}
```

#### Component Structure
```typescript
// 1. Imports (grouped: React, libraries, local)
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

// 2. Interfaces
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

// 3. Component
export function UserProfile({ userId, onUpdate }: UserProfileProps): JSX.Element {
  // 3a. Hooks
  const { data, isLoading } = useUserData(userId);
  
  // 3b. Event handlers
  const handleUpdate = (): void => {
    // logic
  };
  
  // 3c. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### React Query Pattern

#### Query Keys Constants
```typescript
// src/features/users/constants.ts
export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_QUERY_KEYS.all, 'list'] as const,
  list: (filters: UserFilters) => [...USER_QUERY_KEYS.lists(), filters] as const,
  details: () => [...USER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...USER_QUERY_KEYS.details(), id] as const,
} as const;
```

#### Custom Query Hooks
```typescript
// src/features/users/hooks/useUsers.ts
interface UseUsersOptions {
  enabled?: boolean;
  filters?: UserFilters;
}

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useUsers(options?: UseUsersOptions): UseUsersReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: USER_QUERY_KEYS.list(options?.filters ?? {}),
    queryFn: () => fetchUsers(options?.filters),
    enabled: options?.enabled ?? true,
  });

  return {
    users: data ?? [],
    isLoading,
    error,
    refetch,
  };
}
```

#### Mutations
```typescript
// src/features/users/hooks/useCreateUser.ts
interface UseCreateUserReturn {
  createUser: (data: CreateUserInput) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function useCreateUser(): UseCreateUserReturn {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (data: CreateUserInput) => createUserApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });

  return {
    createUser: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
```

### Zustand State Management

#### Store Structure
```typescript
// src/features/auth/state/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  logout: () => void;
}

interface AuthStore extends AuthState, AuthActions {}

export const useAuthStore = create<AuthStore>((set) => ({
  // State
  user: null,
  isAuthenticated: false,
  
  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

#### Store Usage
```typescript
// ✅ DO: Select specific values
function UserProfile() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
}

// ❌ DON'T: Select entire store
function UserProfile() {
  const store = useAuthStore();
}
```

### Zod Schema Validation

#### Schema Definition
```typescript
// src/features/users/schemas/userSchema.ts
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().int().positive().optional(),
});

export const createUserSchema = userSchema.omit({ id: true });

// Export types from schemas
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
```

#### Validation in Forms
```typescript
// src/features/users/components/UserForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface UserFormProps {
  onSubmit: (data: CreateUserInput) => void;
}

export function UserForm({ onSubmit }: UserFormProps): JSX.Element {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

### Constants Pattern

#### Feature Constants
```typescript
// src/features/users/constants.ts
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

export const USER_LIMITS = {
  MAX_NAME_LENGTH: 100,
  MAX_BIO_LENGTH: 500,
  MIN_AGE: 18,
} as const;

// Export types from constants
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];
```

#### Global Constants
```typescript
// src/constants/api.ts
export const API_ENDPOINTS = {
  USERS: '/api/users',
  POSTS: '/api/posts',
  COMMENTS: '/api/comments',
} as const;

export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;
```

## Service Layer

### API Services
```typescript
// src/features/users/services/userService.ts
import { supabase } from '@/integrations/supabase/client';
import type { User, CreateUserInput } from '../types';

export async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function fetchUserById(id: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert(input)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
```

## Naming Conventions

### Files
- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Hooks: `camelCase.ts` starting with `use` (e.g., `useUserData.ts`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Constants: `camelCase.ts` or `SCREAMING_SNAKE_CASE.ts` (e.g., `constants.ts`)
- Types: `camelCase.ts` (e.g., `types.ts`, `interfaces.ts`)
- Services: `camelCase.ts` with suffix (e.g., `userService.ts`)

### Code Elements
- Interfaces: `PascalCase` (e.g., `UserProfile`)
- Types: `PascalCase` (e.g., `UserId`)
- Components: `PascalCase` (e.g., `UserCard`)
- Functions: `camelCase` (e.g., `fetchUserData`)
- Constants: `SCREAMING_SNAKE_CASE` or grouped in objects (e.g., `MAX_USERS` or `API_ENDPOINTS.USERS`)
- Hooks: `camelCase` starting with `use` (e.g., `useUserData`)

## Testing

### No Testing Required
- **Do not create test files**
- **Do not use testing libraries** (Jest, Vitest, Testing Library, etc.)
- **Do not write unit tests, integration tests, or E2E tests**
- Focus on type safety and runtime validation with TypeScript and Zod instead

## Import Guidelines

### Import Order
```typescript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. External library imports
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. Internal imports - UI components
import { Button } from '@/components/ui/button';

// 4. Internal imports - Feature components
import { UserCard } from '../components/UserCard';

// 5. Internal imports - Hooks
import { useUserData } from '../hooks/useUserData';

// 6. Internal imports - Services
import { fetchUsers } from '../services/userService';

// 7. Internal imports - Types
import type { User, UserFilters } from '../types';

// 8. Internal imports - Constants
import { USER_ROLES } from '../constants';
```

### Path Aliases
- Use `@/` for root-level imports
- Use relative paths for feature-internal imports

```typescript
// ✅ DO: Use @ for root imports
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

// ✅ DO: Use relative paths within feature
import { UserCard } from '../components/UserCard';
import { useUserData } from '../hooks/useUserData';
```

## Error Handling

### Service Layer
```typescript
export async function fetchUser(id: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
  
  return data;
}
```

### Component Layer
```typescript
function UserProfile({ userId }: UserProfileProps): JSX.Element {
  const { user, isLoading, error } = useUserData(userId);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>User not found</div>;
  
  return <div>{/* user content */}</div>;
}
```

## Best Practices

### Component Design
- Keep components small and focused
- Extract complex logic into custom hooks
- Use composition over inheritance
- Prefer function components over class components
- Use TypeScript interfaces for all props

### State Management
- Use Zustand for global state (auth, theme, user preferences)
- Use React Query for server state (API data)
- Use local state (useState) for UI-only state
- Avoid prop drilling - use context or Zustand

### Performance
- Use React.memo() sparingly and only when needed
- Memoize expensive calculations with useMemo
- Memoize callbacks with useCallback when passing to optimized children
- Lazy load routes and heavy components

### Code Quality
- No unused imports or variables
- No console.logs in production code
- Use TypeScript strict mode
- Validate all external data with Zod
- Keep functions small and focused

## Forbidden Patterns

### ❌ Don't Use
- `any` type
- Type assertions (`as`) unless absolutely necessary
- Class components
- Higher-order components (use hooks instead)
- Redux (use Zustand instead)
- Axios (use React Query with fetch or Supabase client)
- CSS-in-JS libraries (use Tailwind)
- Test files and testing libraries

### ❌ Don't Do
- Don't mix concerns (UI logic in services, API calls in components)
- Don't create God components
- Don't use inline styles
- Don't duplicate code
- Don't create premature abstractions
- Don't ignore TypeScript errors
- Don't use magic numbers (use constants)

## Project-Specific Guidelines

### Supabase Integration
- All database queries through Supabase client
- Use Row Level Security (RLS) policies
- Type safety with generated Supabase types
- Real-time subscriptions where needed

### UI Components
- Use shadcn/ui components as base
- Extend with feature-specific components
- Maintain consistent styling with Tailwind
- Follow accessibility best practices

### Feature Development Checklist
When creating a new feature:

1. ✅ Create feature folder structure
2. ✅ Define interfaces in `types.ts`
3. ✅ Create Zod schemas in `schemas/`
4. ✅ Define constants in `constants.ts`
5. ✅ Implement services in `services/`
6. ✅ Create custom hooks in `hooks/`
7. ✅ Build components in `components/`
8. ✅ Export public API in `index.ts`
9. ✅ Integrate with Zustand if needed
10. ✅ Set up React Query hooks

## Version Control

### Commit Messages
Follow conventional commits:
```
feat: add user profile page
fix: resolve login redirect issue
refactor: extract user validation logic
style: update button styling
docs: update constitution with new patterns
```

### Branch Strategy
- `main` - production-ready code
- `develop` - integration branch
- `feature/*` - new features
- `fix/*` - bug fixes
- `refactor/*` - code improvements

---

**Remember**: Simplicity, type safety, and maintainability are paramount. When in doubt, choose the simpler solution that follows these principles.
