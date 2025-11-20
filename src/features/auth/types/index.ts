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

// Error response schema
export const errorResponseSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  field: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
