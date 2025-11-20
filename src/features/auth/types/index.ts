import { z } from 'zod';

// User schema
export const userSchema = z.object({
  userId: z.number(),
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type User = z.infer<typeof userSchema>;

// Legacy id field for backward compatibility
export type UserWithId = User & { id: string };

// Auth response schema - matches actual API response
export const authResponseSchema = z.object({
  userId: z.number(),
  email: z.string().email(),
  token: z.string().min(1),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

// Error response schema
export const errorResponseSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  field: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
