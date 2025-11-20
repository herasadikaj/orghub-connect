# Implementation Tasks: User Authentication System

**Feature**: User Authentication System  
**Branch**: `001-user-auth`  
**Date**: November 20, 2025  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Overview

This document breaks down the implementation of the user authentication system into discrete, actionable tasks organized by user story priority. Each user story represents an independently testable increment of functionality.

**Implementation Strategy**: Build MVP first (User Story 1), then add features incrementally. Each phase can be tested independently before moving to the next.

---

## Phase 1: Setup & Infrastructure

**Goal**: Set up project foundation and shared infrastructure needed by all user stories.

**Tasks**:

- [X] T001 Install missing dependencies (axios, @hookform/resolvers if needed)
- [X] T002 [P] Create Axios client configuration in src/lib/axios.ts with empty base URL
- [X] T003 [P] Add request interceptor to attach JWT token from Zustand
- [X] T004 [P] Add response interceptor to handle 401 errors and auto-logout
- [X] T005 Create global API constants in src/constants/api.ts (if not exists)

**Independent Test**: Axios client can be imported and interceptors log correctly.

---

## Phase 2: Foundational Components (Blocking Prerequisites)

**Goal**: Create shared auth infrastructure that all user stories depend on.

**Tasks**:

- [X] T006 Create auth feature directory structure: src/features/auth/{components,hooks,services,types,schemas}
- [X] T007 Define User interface in src/features/auth/types/index.ts
- [X] T008 Define AuthResponse interface in src/features/auth/types/index.ts
- [X] T009 Define ErrorResponse interface in src/features/auth/types/index.ts
- [X] T010 Create Zustand auth store in src/features/auth/store.ts with persist middleware
- [X] T011 [P] Add AUTH_QUERY_KEYS constants in src/features/auth/constants.ts
- [X] T012 [P] Add API_ENDPOINTS constants in src/features/auth/constants.ts
- [X] T013 Create authService skeleton in src/features/auth/services/authService.ts
- [X] T014 Create public exports in src/features/auth/index.ts

**Independent Test**: Auth store can be imported, initial state is correct, localStorage persistence works.

---

## Phase 3: User Story 1 - Existing User Login (P1)

**Goal**: Implement login functionality for existing users.

**Story**: A registered user wants to access their account by providing their credentials and being redirected to the home page upon successful authentication.

**Independent Test**: User can log in with valid credentials and reach home page. Invalid credentials show error and redirect to error page.

### Schemas & Validation

- [X] T015 [US1] Create loginSchema.ts with Zod validation (email, password min 8 chars)
- [X] T016 [US1] Export LoginInput type from loginSchema

### Services

- [X] T017 [US1] Implement authService.login() method with Axios POST to /api/auth/login

### Hooks

- [X] T018 [US1] Create useLogin hook in src/features/auth/hooks/useLogin.ts
- [X] T019 [US1] Integrate React Query mutation in useLogin
- [X] T020 [US1] Add onSuccess handler: setAuth + navigate to home with replace
- [X] T021 [US1] Add onError handler: navigate to /login-error with replace

### Components

- [X] T022 [US1] Create LoginForm component in src/features/auth/components/LoginForm.tsx
- [X] T023 [US1] Integrate React Hook Form with zodResolver(loginSchema)
- [X] T024 [US1] Add email input field with validation error display
- [X] T025 [US1] Add password input field with validation error display
- [X] T026 [US1] Add submit button with loading state (disable when isLoading)
- [X] T027 [US1] Display API error message from useLogin hook

### Pages

- [X] T028 [US1] Update src/pages/Auth.tsx to remove Supabase imports
- [X] T029 [US1] Replace Auth.tsx content with LoginForm component
- [X] T030 [US1] Add link to /signup page for new users
- [X] T031 [US1] Create src/pages/LoginError.tsx with error message and retry link

### Navigation & Guards

- [X] T032 [US1] Create AuthGuard component in src/features/auth/components/AuthGuard.tsx
- [X] T033 [US1] Add useEffect to redirect unauthenticated users to /auth
- [X] T034 [US1] Wrap Index.tsx route with AuthGuard in App.tsx
- [X] T035 [US1] Add route for /login-error page in App.tsx

**Phase 3 Acceptance**:
- ✅ Valid credentials → Home page
- ✅ Invalid credentials → Error page with message
- ✅ Empty fields → Validation errors shown
- ✅ Unauthenticated users redirected to /auth
- ✅ Token persists across page refresh

---

## Phase 4: User Story 2 - New User Sign-Up (P2)

**Goal**: Implement account creation with automatic login.

**Story**: A new user wants to create an account, and upon successful registration, be automatically logged in and redirected to the home page.

**Independent Test**: User can create account, be automatically logged in, and reach home page. Duplicate email shows error.

### Schemas & Validation

- [X] T036 [P] [US2] Create signupSchema.ts with Zod validation (email, password complexity, name optional)
- [X] T037 [P] [US2] Add password strength rules (uppercase, lowercase, number)
- [X] T038 [P] [US2] Export SignupInput type from signupSchema

### Services

- [X] T039 [US2] Implement authService.signup() method with Axios POST to /api/auth/signup

### Hooks

- [X] T040 [US2] Create useSignup hook in src/features/auth/hooks/useSignup.ts
- [X] T041 [US2] Integrate React Query mutation in useSignup
- [X] T042 [US2] Add onSuccess handler: setAuth + navigate to home with replace (auto-login)
- [X] T043 [US2] Add error handling for duplicate email (409) and validation errors (400)

### Components

- [X] T044 [US2] Create SignupForm component in src/features/auth/components/SignupForm.tsx
- [X] T045 [US2] Integrate React Hook Form with zodResolver(signupSchema)
- [X] T046 [US2] Add email input field with validation
- [X] T047 [US2] Add password input field with strength indicator
- [X] T048 [US2] Add optional name input field
- [X] T049 [US2] Add submit button with loading state
- [X] T050 [US2] Display API error messages (duplicate email, validation)

### Pages

- [X] T051 [US2] Create src/pages/Signup.tsx page
- [X] T052 [US2] Add SignupForm component to Signup page
- [X] T053 [US2] Add link to /auth page for existing users
- [X] T054 [US2] Add route for /signup page in App.tsx
- [X] T055 [US2] Update Auth.tsx to add link to /signup page

**Phase 4 Acceptance**:
- ✅ Valid signup → Account created + auto-login + Home page
- ✅ Duplicate email → Error message shown
- ✅ Weak password → Validation error shown
- ✅ Empty fields → Validation errors shown
- ✅ Auto-login after signup works

---

## Phase 5: User Story 3 - Profile Access (P3)

**Goal**: Allow authenticated users to view and edit their profile.

**Story**: An authenticated user wants to view their profile information by navigating from the home page to access their personal details.

**Independent Test**: User can navigate to profile page, view their info, edit it, and changes persist.

### Schemas & Validation

- [X] T056 [P] [US3] Create profileSchema.ts with Zod validation for updates (name, email optional)
- [X] T057 [P] [US3] Add validation: at least one field required
- [X] T058 [P] [US3] Export UpdateProfileInput type

### Services

- [X] T059 [US3] Implement authService.getProfile() method with Axios GET to /api/profile
- [X] T060 [US3] Implement authService.updateProfile() method with Axios PUT to /api/profile

### Hooks

- [X] T061 [US3] Create useProfile hook in src/features/auth/hooks/useProfile.ts
- [X] T062 [US3] Integrate React Query with AUTH_QUERY_KEYS.profile()
- [X] T063 [US3] Add enabled option: only if isAuthenticated
- [X] T064 [US3] Create useUpdateProfile hook in src/features/auth/hooks/useUpdateProfile.ts
- [X] T065 [US3] Add React Query mutation with optimistic updates
- [X] T066 [US3] Add onMutate for optimistic UI update
- [X] T067 [US3] Add onError to rollback optimistic update
- [X] T068 [US3] Add onSettled to invalidate profile query
- [X] T069 [US3] Create useLogout hook in src/features/auth/hooks/useLogout.ts
- [X] T070 [US3] Implement logout: clear store + clear React Query cache + navigate to /auth

### Components

- [X] T071 [US3] Create ProfileForm component in src/features/auth/components/ProfileForm.tsx
- [X] T072 [US3] Integrate React Hook Form with zodResolver(profileSchema)
- [X] T073 [US3] Pre-fill form with current user data from useProfile
- [X] T074 [US3] Add name input field
- [X] T075 [US3] Add email input field
- [X] T076 [US3] Add save button with loading state
- [X] T077 [US3] Display success message on save
- [X] T078 [US3] Create ProfileButton component for navigation in src/features/auth/components/ProfileButton.tsx

### Pages

- [X] T079 [US3] Create src/pages/Profile.tsx page
- [X] T080 [US3] Use useProfile hook to fetch and display user data
- [X] T081 [US3] Show loading state while fetching profile
- [X] T082 [US3] Display user email and name
- [X] T083 [US3] Add ProfileForm component for editing
- [X] T084 [US3] Add logout button using useLogout hook
- [X] T085 [US3] Add navigation back to home
- [X] T086 [US3] Wrap Profile route with AuthGuard in App.tsx
- [X] T087 [US3] Add /profile route to App.tsx
- [X] T088 [US3] Update Index.tsx (Home) to add ProfileButton in navigation

**Phase 5 Acceptance**:
- ✅ Profile button visible on home page
- ✅ Profile page shows user email and name
- ✅ User can edit name and email
- ✅ Changes persist after save
- ✅ Unauthenticated users redirected to login
- ✅ Logout clears auth and redirects to login

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Add finishing touches and handle edge cases.

**Tasks**:

- [X] T089 Add password visibility toggle to LoginForm and SignupForm
- [X] T090 Add form reset after successful login/signup
- [X] T091 Add loading spinner for profile data fetch
- [X] T092 Handle network errors gracefully with user-friendly messages
- [X] T093 Add duplicate request prevention (disable buttons during loading)
- [X] T094 Test token expiry scenario (401 response triggers logout)
- [X] T095 Test localStorage persistence (page refresh maintains auth)
- [ ] T096 Add proper error boundaries for auth components
- [X] T097 Ensure all navigation uses replace: true to prevent back-button issues
- [X] T098 Add aria labels for accessibility
- [ ] T099 Test on mobile viewport (responsive design)
- [ ] T100 Remove all Supabase imports and references from codebase

---

## Dependency Graph

Shows which user stories can be worked on independently:

```
Phase 1 (Setup) → Phase 2 (Foundational)
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
    Phase 3        Phase 4        Phase 5
    (US1: Login)   (US2: Signup)  (US3: Profile)
    [Independent]  [Independent]  [Depends on US1 for AuthGuard]
        ↓              ↓              ↓
        └──────────────┼──────────────┘
                       ↓
                  Phase 6 (Polish)
```

**Critical Path**: Phase 1 → Phase 2 → Phase 3 (US1) → Phase 5 (US3)

**Parallel Work**: After Phase 2, US1 and US2 can be developed simultaneously by different developers.

---

## Parallel Execution Examples

### Scenario 1: Single Developer (Sequential)
1. Complete Phase 1-2 (setup)
2. Implement US1 completely (login)
3. Implement US2 completely (signup)
4. Implement US3 completely (profile)
5. Polish (Phase 6)

### Scenario 2: Two Developers (Parallel)
- **Dev A**: Phase 1-2 → US1 (login) → US3 (profile) → Polish
- **Dev B**: Wait for Phase 2 → US2 (signup) → Help with polish

### Scenario 3: Three Developers (Maximum Parallelism)
- **Dev A**: Phase 1-2 → US1 (login) → Polish
- **Dev B**: Wait for Phase 2 → US2 (signup) → Polish
- **Dev C**: Wait for Phase 2 + US1 → US3 (profile) → Polish

---

## Implementation Strategy

### MVP (Minimum Viable Product)
**Scope**: Phase 1 + Phase 2 + Phase 3 (US1 - Login only)

This delivers:
- ✅ User login functionality
- ✅ Protected routes
- ✅ Token persistence
- ✅ Error handling

**Time Estimate**: ~4-6 hours for experienced developer

### V1 (Full Feature)
**Scope**: MVP + Phase 4 (US2) + Phase 5 (US3) + Phase 6

This delivers:
- ✅ Complete authentication system
- ✅ User registration
- ✅ Profile management
- ✅ All edge cases handled

**Time Estimate**: ~8-12 hours for experienced developer

---

## Task Execution Guidelines

1. **Format**: Each task follows `- [ ] T### [Labels] Description with file path`
2. **[P] Label**: Task can be parallelized (different files, no dependencies)
3. **[US#] Label**: Task belongs to specific user story
4. **No Label**: Sequential task or setup task
5. **File Paths**: Each task specifies exact file to create/modify
6. **Checkboxes**: Mark `[x]` when task completed
7. **Testing**: Test each phase independently before proceeding

---

## Notes

- **No Tests**: Per constitution, no test files are created
- **Type Safety**: All interfaces use strict TypeScript
- **Validation**: All forms use Zod + React Hook Form
- **State**: Zustand for auth, React Query for server state
- **API**: All endpoints use Axios with empty base URL
- **Navigation**: All redirects use `replace: true`

---

## Success Criteria

Each phase has acceptance criteria that must be met before proceeding:

✅ **Phase 3 (US1)**: Login works, protected routes work, errors handled  
✅ **Phase 4 (US2)**: Signup works, auto-login works, duplicate email handled  
✅ **Phase 5 (US3)**: Profile view/edit works, logout works, navigation works  
✅ **Phase 6 (Polish)**: All edge cases handled, UX polished, no Supabase refs

---

**Total Tasks**: 100  
**Estimated Complexity**: Medium  
**Estimated Time**: 8-12 hours (experienced developer)  
**Critical Path**: 35 tasks (T001-T035)  
**Parallel Opportunities**: 15 tasks marked with [P]

**Ready for Implementation**: ✅
