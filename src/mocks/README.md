# Mock Data

This directory contains dummy/mock data for development and testing purposes.

## 🚀 Quick Start - Using Mock Data

To use mock data instead of the real backend API:

1. **Create a `.env.local` file** in the project root:
   ```bash
   VITE_USE_MOCK_AUTH=true
   ```

2. **Restart the dev server** (environment changes require restart):
   ```bash
   npm run dev
   ```

3. **Login with mock credentials**:
   - Email: `john.doe@example.com`, Password: `Password123`
   - Email: `jane.smith@example.com`, Password: `securePass456`
   - Email: `michael.johnson@example.com`, Password: `test1234`

That's it! The app will now use mock data without needing the backend server.

## Available Mock Data

### Profile Data (`profileData.ts`)

Mock user profiles for testing the profile feature.

**Usage Examples**:

```typescript
import { 
  mockProfiles, 
  defaultTestProfile, 
  getRandomProfile,
  getProfileById,
  profileWithoutName 
} from '@/mocks/profileData';

// Get all mock profiles
console.log(mockProfiles); // Array of 10 User objects

// Use default test profile
const user = defaultTestProfile;

// Get random profile
const randomUser = getRandomProfile();

// Get specific profile
const user3 = getProfileById(3);

// Test profile without name field
const newUser = profileWithoutName;
```

**Mock Profiles Include**:
- 10 complete user profiles with all fields
- 1 profile without optional name field
- Helper functions for retrieval

### Auth Data (`authData.ts`)

Mock authentication responses and credentials for testing login/signup flows.

**Usage Examples**:

```typescript
import { 
  mockAuthResponses,
  mockCredentials,
  validateMockCredentials,
  generateMockToken 
} from '@/mocks/authData';

// Test login validation
const authResponse = validateMockCredentials(
  'john.doe@example.com',
  'password123'
);

if (authResponse) {
  console.log('Login successful:', authResponse.token);
}

// Get auth response by email
const auth = getMockAuthByEmail('jane.smith@example.com');

// Generate custom mock token
const customToken = generateMockToken(999, 'test@example.com');
```

**Mock Credentials**:
- `john.doe@example.com` / `Password123`
- `jane.smith@example.com` / `securePass456`
- `michael.johnson@example.com` / `test1234`
- `sarah.williams@example.com` / `myPassword789`
- `david.brown@example.com` / `brownD2024!`

## Integration with MSW (Mock Service Worker)

You can use this data with MSW for API mocking:

```typescript
import { http, HttpResponse } from 'msw';
import { mockProfiles, validateMockCredentials } from '@/mocks';

export const handlers = [
  // Mock login endpoint
  http.post('http://10.138.80.113:5000/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();
    const authResponse = validateMockCredentials(email, password);
    
    if (authResponse) {
      return HttpResponse.json(authResponse);
    }
    
    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // Mock profile endpoint
  http.get('http://10.138.80.113:5000/api/api/profile', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Return first mock profile for authenticated requests
    return HttpResponse.json(mockProfiles[0]);
  }),
];
```

## Testing Tips

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import { defaultTestProfile } from '@/mocks';
import Profile from '@/pages/Profile';

test('renders profile information', () => {
  render(<Profile user={defaultTestProfile} />);
  expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### Storybook Stories

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { mockProfiles } from '@/mocks';
import ProfileCard from '@/components/ProfileCard';

const meta: Meta<typeof ProfileCard> = {
  component: ProfileCard,
};

export default meta;
type Story = StoryObj<typeof ProfileCard>;

export const Default: Story = {
  args: {
    user: mockProfiles[0],
  },
};

export const WithoutName: Story = {
  args: {
    user: profileWithoutName,
  },
};
```

## Notes

- Mock data is TypeScript-safe and matches actual data types
- JWT tokens are mock tokens (not real encrypted tokens)
- Timestamps use ISO 8601 format
- All data is deterministic for consistent testing
- Do not use mock data in production builds
