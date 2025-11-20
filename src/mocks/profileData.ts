import type { User } from '@/features/auth/types';

/**
 * Mock profile data for development and testing
 */

export const mockProfiles: User[] = [
  {
    userId: 1,
    email: 'john.doe@example.com',
    name: 'John Doe',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-11-20T14:22:00Z',
  },
  {
    userId: 2,
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    createdAt: '2024-02-20T08:45:00Z',
    updatedAt: '2024-11-19T16:10:00Z',
  },
  {
    userId: 3,
    email: 'michael.johnson@example.com',
    name: 'Michael Johnson',
    createdAt: '2024-03-10T12:00:00Z',
    updatedAt: '2024-11-18T09:30:00Z',
  },
  {
    userId: 4,
    email: 'sarah.williams@example.com',
    name: 'Sarah Williams',
    createdAt: '2024-04-05T15:20:00Z',
    updatedAt: '2024-11-17T11:45:00Z',
  },
  {
    userId: 5,
    email: 'david.brown@example.com',
    name: 'David Brown',
    createdAt: '2024-05-12T09:10:00Z',
    updatedAt: '2024-11-16T13:55:00Z',
  },
  {
    userId: 6,
    email: 'emily.davis@example.com',
    name: 'Emily Davis',
    createdAt: '2024-06-18T14:30:00Z',
    updatedAt: '2024-11-15T10:20:00Z',
  },
  {
    userId: 7,
    email: 'james.miller@example.com',
    name: 'James Miller',
    createdAt: '2024-07-22T11:45:00Z',
    updatedAt: '2024-11-14T15:30:00Z',
  },
  {
    userId: 8,
    email: 'olivia.wilson@example.com',
    name: 'Olivia Wilson',
    createdAt: '2024-08-08T16:00:00Z',
    updatedAt: '2024-11-13T12:40:00Z',
  },
  {
    userId: 9,
    email: 'robert.moore@example.com',
    name: 'Robert Moore',
    createdAt: '2024-09-14T10:25:00Z',
    updatedAt: '2024-11-12T09:15:00Z',
  },
  {
    userId: 10,
    email: 'sophia.taylor@example.com',
    name: 'Sophia Taylor',
    createdAt: '2024-10-01T13:50:00Z',
    updatedAt: '2024-11-11T14:05:00Z',
  },
];

/**
 * Default test profile for quick testing
 */
export const defaultTestProfile: User = mockProfiles[0];

/**
 * Profile without optional name field
 */
export const profileWithoutName: User = {
  userId: 99,
  email: 'new.user@example.com',
  createdAt: '2024-11-20T10:00:00Z',
  updatedAt: '2024-11-20T10:00:00Z',
};

/**
 * Get a random mock profile
 */
export const getRandomProfile = (): User => {
  const randomIndex = Math.floor(Math.random() * mockProfiles.length);
  return mockProfiles[randomIndex];
};

/**
 * Get mock profile by userId
 */
export const getProfileById = (userId: number): User | undefined => {
  return mockProfiles.find(profile => profile.userId === userId);
};

/**
 * Get mock profile by email
 */
export const getProfileByEmail = (email: string): User | undefined => {
  return mockProfiles.find(profile => profile.email === email);
};
