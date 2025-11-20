# Mock Data Setup Guide

## Overview

The authentication system can work in two modes:
1. **Production Mode**: Real API calls to backend server
2. **Mock Mode**: Uses dummy data for development without backend

## Enabling Mock Mode

### Step 1: Create Environment File

Create a file named `.env.local` in the project root:

```bash
# .env.local
VITE_USE_MOCK_AUTH=true
```

### Step 2: Restart Dev Server

**Important**: Vite only reads environment variables on startup.

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Login with Mock Credentials

Use any of these test accounts:

| Email | Password | User |
|-------|----------|------|
| `john.doe@example.com` | `Password123` | John Doe |
| `jane.smith@example.com` | `securePass456` | Jane Smith |
| `michael.johnson@example.com` | `test1234` | Michael Johnson |
| `sarah.williams@example.com` | `myPassword789` | Sarah Williams |
| `david.brown@example.com` | `brownD2024!` | David Brown |

## Features in Mock Mode

✅ **Login** - Works with mock credentials  
✅ **Signup** - Creates mock accounts (validates email uniqueness)  
✅ **Profile View** - Shows mock profile data  
✅ **Profile Edit** - Updates mock profile (simulated)  
✅ **Logout** - Clears auth state  
✅ **Token Persistence** - Mock tokens stored in localStorage  
✅ **Error Handling** - Invalid credentials show proper errors  

## Switching Back to Real API

Remove or set to `false` in `.env.local`:

```bash
VITE_USE_MOCK_AUTH=false
```

Then restart the dev server.

## How It Works

### Environment Variable

```typescript
// authService.ts
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_AUTH === 'true';
export const authService = USE_MOCK_DATA ? mockAuthService : realAuthService;
```

### Mock Service

The `mockAuthService` implements the same interface as `authService`:
- `login()` - Validates against mock credentials array
- `signup()` - Checks for duplicate emails, generates mock token
- `getProfile()` - Returns mock user data
- `updateProfile()` - Simulates profile updates

### Network Simulation

Mock service adds 300ms delay to simulate network latency:

```typescript
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));
```

## Testing Scenarios

### Valid Login
```
Email: john.doe@example.com
Password: Password123
Result: ✅ Login successful → Home page
```

### Invalid Password
```
Email: john.doe@example.com
Password: wrong
Result: ❌ "Invalid email or password" error
```

### Duplicate Email Signup
```
Email: john.doe@example.com (already exists)
Password: NewPass123
Result: ❌ "Email already exists" error
```

### New Account Signup
```
Email: newuser@example.com
Password: SecurePass123
Result: ✅ Account created → Auto-login → Home page
```

### Profile Update
```
Current: john.doe@example.com
Update to: john.updated@example.com
Result: ✅ Profile updated successfully
```

## Troubleshooting

### Mock mode not working?

1. **Check environment variable**:
   ```bash
   # Open .env.local and verify:
   VITE_USE_MOCK_AUTH=true
   ```

2. **Restart dev server** (required for env changes):
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```

3. **Check browser console** for logs:
   ```
   Should NOT see CORS errors
   Should NOT see network requests to 10.138.80.113:5000
   ```

4. **Verify credentials match exactly** (case-sensitive):
   - Email: `john.doe@example.com` (all lowercase)
   - Password: `Password123` (capital P)

### Still seeing CORS errors?

CORS errors mean the real API is being called. Verify:
- `.env.local` exists in project root
- `VITE_USE_MOCK_AUTH=true` (no spaces, no quotes)
- Dev server was restarted after creating `.env.local`

## Production Deployment

**Important**: Never deploy with mock mode enabled!

```bash
# Before deploying, ensure:
VITE_USE_MOCK_AUTH=false

# Or delete .env.local entirely (it's gitignored)
```

Mock mode is for **local development only**.

## Advanced: Adding More Mock Users

Edit `src/mocks/authData.ts`:

```typescript
export const mockCredentials = [
  // ... existing users
  {
    email: 'your.email@example.com',
    password: 'YourPassword123',
    response: {
      userId: 999,
      email: 'your.email@example.com',
      token: generateMockToken(999, 'your.email@example.com'),
    },
  },
];
```

No server restart needed for mock data changes (only for env variables).
