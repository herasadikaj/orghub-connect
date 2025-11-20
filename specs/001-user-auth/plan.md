# Implementation Plan: User Authentication System

**Branch**: `001-user-auth` | **Date**: November 20, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-user-auth/spec.md`

**Note**: This plan implements REST API-based authentication with Axios service layer, Zustand state management, and React Hook Form validation.

## Summary

Implement a complete user authentication system with login, sign-up, and profile management. Users authenticate via email/password against a REST API, with JWT tokens stored in Zustand + localStorage for persistence. The system includes form validation with React Hook Form + Zod, custom hooks (useLogin, useSignup, useProfile, useAuthGuard), protected route handling, and profile editing capabilities. All API communication uses Axios with a centralized service layer following the ReadQuery pattern.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Primary Dependencies**: 
- React 18+ with Vite
- Axios (HTTP client for REST API)
- React Query (TanStack Query) for server state
- Zustand for global state management
- Zod for schema validation
- React Hook Form for form management
- React Router for navigation
- shadcn/ui + Tailwind CSS for UI

**Storage**: 
- JWT tokens in Zustand store + localStorage
- API base URL: http://10.138.80.113:5000/api
- User profile data fetched from REST API

**Testing**: None (per constitution: no test files)  
**Target Platform**: Web application (modern browsers: Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application with feature-based architecture  
**Performance Goals**: 
- Login/signup response < 2 seconds
- Form validation feedback < 100ms
- Protected route checks < 50ms
- Profile data load < 1 second

**Constraints**: 
- Must work with REST API (not Supabase)
- API base URL: http://10.138.80.113:5000/api
- JWT token-based authentication
- All API requests use Content-Type: application/json
- Protected endpoints require Authorization: Bearer {token} header
- Client-side session persistence
- No test files

**Scale/Scope**: 
- 4 pages (Login, Signup, Home, Profile, LoginError)
- 4 custom hooks (useLogin, useSignup, useProfile, useAuthGuard)
- 1 Zustand store (auth)
- 4 REST endpoints (login, signup, profile GET, profile PUT)
- ~15-20 components total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Core Principles Compliance

✅ **YAGNI**: Only implementing required features (login, signup, profile). No speculative features like password reset, OAuth, or multi-factor auth.

✅ **KISS**: Simple REST API pattern with straightforward token-based auth. No complex middleware or over-engineered abstractions.

✅ **DRY**: Custom hooks for reusable logic (useLogin, useSignup, useProfile, useAuthGuard). Constants for API endpoints and validation messages.

### Architecture Compliance

✅ **Feature-Based Architecture**: Auth feature will follow structure:
```
src/features/auth/
  components/     # LoginForm, SignupForm, ProfileForm
  hooks/          # useLogin, useSignup, useProfile, useAuthGuard
  services/       # authService (Axios calls)
  types/          # Auth interfaces
  schemas/        # Zod validation schemas
  constants.ts    # API endpoints, error messages
  store.ts        # Zustand auth store
  index.ts        # Public exports
```

✅ **TypeScript**: All interfaces, strict mode, no `any` types.

✅ **Hooks Pattern**: Custom hooks for all auth logic.

✅ **Zod Validation**: All forms validated with Zod schemas.

✅ **Zustand**: Auth state (user, token, isAuthenticated) in Zustand store.

✅ **Constants Pattern**: API endpoints and messages in constants file.

### Technology Stack Violations

⚠️ **VIOLATION #1**: Using Axios instead of Supabase client
- **Reason**: User explicitly specified REST API with Axios service layer
- **Constitution states**: "Backend: Supabase" and "Axios (use React Query with fetch or Supabase client)" is forbidden
- **Justification**: User requirement overrides default constitution. REST API architecture is valid and simpler than Supabase for this use case.

⚠️ **VIOLATION #2**: React Hook Form added as dependency
- **Reason**: User specified React Hook Form for form management
- **Constitution doesn't list**: React Hook Form in required libraries
- **Justification**: React Hook Form is industry standard and integrates perfectly with Zod. Simpler than building custom form handlers.

✅ **React Query**: Still using React Query for server state management (ReadQuery pattern).

✅ **No Tests**: Following constitution's "No Testing Required" policy.

### Gates Status

🟢 **PASS** - Violations are justified by explicit user requirements. Core principles (YAGNI, KISS, DRY) and architecture patterns are fully respected.

## Project Structure

### Documentation (this feature)

```text
specs/001-user-auth/
├── plan.md              # This file
├── research.md          # REST API patterns, Axios setup, token management
├── data-model.md        # User, AuthResponse, LoginRequest, SignupRequest interfaces
├── quickstart.md        # Setup and usage guide
├── contracts/           # OpenAPI specs for auth endpoints
│   ├── login.yaml
│   ├── signup.yaml
│   ├── get-profile.yaml
│   └── update-profile.yaml
└── checklists/
    └── requirements.md  # Already created
```

### Source Code (repository root)

```text
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
│       │   └── authService.ts       # Axios API calls
│       ├── types/
│       │   └── index.ts             # Auth interfaces
│       ├── schemas/
│       │   ├── loginSchema.ts
│       │   ├── signupSchema.ts
│       │   └── profileSchema.ts
│       ├── store.ts                 # Zustand auth store
│       ├── constants.ts             # API endpoints, messages
│       └── index.ts                 # Public exports
│
├── pages/
│   ├── Auth.tsx                     # Login page (already exists)
│   ├── Signup.tsx                   # New signup page
│   ├── Index.tsx                    # Home page (already exists)
│   ├── Profile.tsx                  # New profile page
│   ├── LoginError.tsx               # New login error page
│   └── NotFound.tsx                 # Already exists
│
├── lib/
│   ├── axios.ts                     # Axios instance configuration
│   └── utils.ts                     # Already exists
│
├── constants/
│   └── api.ts                       # Global API configuration
│
└── types/
    └── api.ts                       # Shared API response types
```

**Structure Decision**: Web application using feature-based architecture. The `auth` feature is self-contained in `src/features/auth/` with all related components, hooks, services, types, schemas, and state management. Pages are in `src/pages/` following existing structure. Shared utilities and configurations are in `src/lib/` and `src/constants/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Axios instead of Supabase client | User explicitly requires REST API with Axios service layer. Backend is separate REST API, not Supabase. | Supabase client requires Supabase backend. User's architecture is REST API-based. Axios is simpler and more appropriate for generic REST APIs. |
| React Hook Form (not in constitution) | User specified React Hook Form for form management. Industry standard with excellent Zod integration. | Building custom form handlers would violate DRY (duplicate code for each form). React Hook Form provides validation, error handling, and form state out of the box. Simpler than alternatives. |
| localStorage for token persistence | Required for user sessions to persist across browser refreshes. Zustand alone loses state on page reload. | Cookies could work but localStorage is simpler, more explicit, and doesn't require backend cookie configuration. Session storage would lose data on new tabs. |

---

## Phase 0: Research (Completed)

**Output**: [research.md](./research.md)

All technical unknowns have been researched and resolved:

1. ✅ REST API authentication pattern with JWT tokens
2. ✅ Token storage strategy (Zustand + localStorage)
3. ✅ React Query integration with Axios
4. ✅ Form validation with React Hook Form + Zod
5. ✅ Protected routes pattern (AuthGuard component)
6. ✅ Error handling strategy
7. ✅ Navigation flows after authentication
8. ✅ API base URL configuration (empty string)
9. ✅ Profile editing implementation
10. ✅ Loading state management

**Key Decisions**:
- JWT Bearer token authentication with Axios interceptors
- Zustand with persist middleware for state + localStorage
- React Query for server state caching
- zodResolver for Zod + React Hook Form integration
- AuthGuard component for route protection
- Empty string base URL (relative paths)

---

## Phase 1: Design & Contracts (Completed)

### Data Model

**Output**: [data-model.md](./data-model.md)

Defined entities and interfaces:

**Core Entities**:
- `User`: User profile with id, email, name, timestamps
- `AuthResponse`: Login/signup response with token + user
- `LoginRequest`: Email and password for login
- `SignupRequest`: Email, password, optional name for registration
- `UpdateProfileRequest`: Optional name and email updates
- `ErrorResponse`: Standardized error structure

**State Management**:
- `AuthStore`: Zustand store with user, token, isAuthenticated, setAuth, logout

**Validation**:
- All entities have Zod schemas for runtime validation
- Types generated from schemas using `z.infer<typeof schema>`

### API Contracts

**Output**: [contracts/](./contracts/)

Created OpenAPI 3.0 specifications for all endpoints:

1. **POST /auth/login** ([login.yaml](./contracts/login.yaml))
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body: `{"email": "user@example.com", "password": "string"}`
   - Returns: `{"userId": 3, "email": "user@example.com", "token": "JWT_TOKEN"}`
   - Errors: 400 (validation), 401 (invalid credentials), 500 (server)

2. **POST /auth/register** ([signup.yaml](./contracts/signup.yaml))
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body: `{"email": "user@example.com", "password": "string"}`
   - Returns: `{"userId": 3, "email": "user@example.com", "token": "JWT_TOKEN"}`
   - Errors: 400 (validation), 409 (duplicate email), 500 (server)

3. **GET /api/profile** ([get-profile.yaml](./contracts/get-profile.yaml))
   - Method: GET
   - Headers: `Authorization: Bearer {token}`
   - Returns: user profile
   - Errors: 401 (unauthorized), 404 (not found), 500 (server)

4. **PUT /api/profile** ([update-profile.yaml](./contracts/update-profile.yaml))
   - Method: PUT
   - Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`
   - Body: optional `{"name": "string", "email": "string"}`
   - Returns: updated user profile
   - Errors: 400 (validation), 401 (unauthorized), 409 (duplicate email), 500 (server)

### Quickstart Guide

**Output**: [quickstart.md](./quickstart.md)

Comprehensive setup and usage guide including:
- Prerequisites and installation steps
- Project structure explanation
- Environment setup (Axios, React Query, no env vars needed)
- Step-by-step development workflow
- Code examples for all components and hooks
- Usage examples for common scenarios
- API integration details
- Troubleshooting guide

### Agent Context Update

**Output**: `.github/agents/copilot-instructions.md`

Updated GitHub Copilot context file with:
- Language: TypeScript 5.x (strict mode)
- Project type: Web application with feature-based architecture
- Technologies specific to this feature

---

## Phase 2: Constitution Re-Evaluation

### Post-Design Constitution Check

After completing research and design phases, re-evaluating constitution compliance:

✅ **Core Principles Still Met**:
- **YAGNI**: Only implemented required features, no gold-plating
- **KISS**: Straightforward patterns, no over-engineering
- **DRY**: Custom hooks eliminate code duplication

✅ **Architecture Compliance**:
- Feature-based structure maintained
- All TypeScript with strict mode
- Hooks pattern for all logic
- Zod validation everywhere
- Zustand for auth state
- Constants pattern for API endpoints and messages

✅ **Technology Decisions Justified**:
- Axios: Required by user, appropriate for REST API
- React Hook Form: Industry standard, simpler than alternatives
- localStorage: Required for persistence, acceptable trade-off

✅ **No New Violations Introduced**:
- All violations were pre-identified and justified
- Design decisions align with original justifications
- No additional complexity added beyond requirements

### Final Gates Status

🟢 **PASS** - All design decisions comply with constitution principles. Violations remain justified and minimal. Ready for implementation.

---

## Implementation Readiness Checklist

- [x] Technical context fully documented
- [x] All research questions answered (10/10)
- [x] Data model defined with Zod schemas
- [x] API contracts created (4 endpoints)
- [x] Quickstart guide complete
- [x] Agent context updated
- [x] Constitution compliance verified
- [x] No unresolved "NEEDS CLARIFICATION" items
- [x] Project structure defined
- [x] Complexity justified

---

## Next Steps

This plan is complete. To proceed with implementation:

1. **Run `/speckit.tasks`** to generate task breakdown from this plan
2. **Begin implementation** following the structure in quickstart.md
3. **Reference contracts/** for exact API specifications
4. **Follow data-model.md** for type definitions
5. **Consult research.md** for technical decisions and patterns

---

## Artifacts Summary

| Artifact | Status | Location | Purpose |
|----------|--------|----------|---------|
| Implementation Plan | ✅ Complete | plan.md | Overall architecture and decisions |
| Research | ✅ Complete | research.md | Technical patterns and decisions |
| Data Model | ✅ Complete | data-model.md | Entity definitions and schemas |
| API Contracts | ✅ Complete | contracts/*.yaml | OpenAPI endpoint specifications |
| Quickstart Guide | ✅ Complete | quickstart.md | Setup and usage instructions |
| Agent Context | ✅ Updated | .github/agents/copilot-instructions.md | AI assistant context |
| Requirements Checklist | ✅ Complete | checklists/requirements.md | Spec quality validation |

---

**Plan Version**: 1.0.0  
**Status**: Ready for Implementation  
**Phase**: Planning Complete → Ready for `/speckit.tasks`
