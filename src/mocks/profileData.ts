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
  {
    userId: 11,
    email: 'alex.martinez@example.com',
    name: 'Alex Martinez',
    createdAt: '2024-02-14T09:20:00Z',
    updatedAt: '2024-11-20T08:30:00Z',
  },
  {
    userId: 12,
    email: 'chris.anderson@example.com',
    name: 'Chris Anderson',
    createdAt: '2024-03-22T11:15:00Z',
    updatedAt: '2024-11-19T15:45:00Z',
  },
  {
    userId: 13,
    email: 'patricia.thomas@example.com',
    name: 'Patricia Thomas',
    createdAt: '2024-04-18T14:40:00Z',
    updatedAt: '2024-11-18T10:20:00Z',
  },
  {
    userId: 14,
    email: 'kevin.jackson@example.com',
    name: 'Kevin Jackson',
    createdAt: '2024-05-25T16:55:00Z',
    updatedAt: '2024-11-17T13:10:00Z',
  },
  {
    userId: 15,
    email: 'lisa.white@example.com',
    name: 'Lisa White',
    createdAt: '2024-06-30T10:25:00Z',
    updatedAt: '2024-11-16T09:40:00Z',
  },
  {
    userId: 16,
    email: 'mark.harris@example.com',
    name: 'Mark Harris',
    createdAt: '2024-07-15T13:35:00Z',
    updatedAt: '2024-11-15T14:55:00Z',
  },
  {
    userId: 17,
    email: 'nancy.martin@example.com',
    name: 'Nancy Martin',
    createdAt: '2024-08-20T08:50:00Z',
    updatedAt: '2024-11-14T11:30:00Z',
  },
  {
    userId: 18,
    email: 'paul.thompson@example.com',
    name: 'Paul Thompson',
    createdAt: '2024-09-10T15:10:00Z',
    updatedAt: '2024-11-13T16:20:00Z',
  },
  {
    userId: 19,
    email: 'rachel.garcia@example.com',
    name: 'Rachel Garcia',
    createdAt: '2024-10-05T12:30:00Z',
    updatedAt: '2024-11-12T10:45:00Z',
  },
  {
    userId: 20,
    email: 'steve.robinson@example.com',
    name: 'Steve Robinson',
    createdAt: '2024-10-28T09:45:00Z',
    updatedAt: '2024-11-11T15:05:00Z',
  },
];

/**
 * Default test profile for quick testing
 */
export const defaultTestProfile: User = {
  userId: 100,
  email: 'o.merxira@teamsystem.com',
  name: 'Orges Merxira',
  createdAt: '2024-11-20T08:00:00Z',
  updatedAt: '2024-11-20T15:30:00Z',
};

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
 * Profile with only required fields (minimal profile)
 */
export const minimalProfile: User = {
  userId: 100,
  email: 'minimal@example.com',
};

/**
 * Recently created profile (for testing new user scenarios)
 */
export const newProfile: User = {
  userId: 101,
  email: 'new.account@example.com',
  name: 'New User',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Profile with long name (edge case testing)
 */
export const longNameProfile: User = {
  userId: 102,
  email: 'longname@example.com',
  name: 'Christopher Alexander Montgomery III',
  createdAt: '2024-11-01T10:00:00Z',
  updatedAt: '2024-11-20T10:00:00Z',
};

/**
 * Profile with special characters in name
 */
export const specialCharProfile: User = {
  userId: 103,
  email: 'special@example.com',
  name: "O'Brien-Smith Jr.",
  createdAt: '2024-11-01T10:00:00Z',
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

/**
 * Get multiple random profiles
 */
export const getRandomProfiles = (count: number): User[] => {
  const shuffled = [...mockProfiles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, mockProfiles.length));
};

/**
 * Simulate profile update (for testing)
 */
export const simulateProfileUpdate = (userId: number, updates: Partial<User>): User | undefined => {
  const profile = getProfileById(userId);
  if (!profile) return undefined;
  
  return {
    ...profile,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
};
