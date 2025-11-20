import { z } from 'zod';

export const profileSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: 'At least one field must be provided',
  });

export type UpdateProfileInput = z.infer<typeof profileSchema>;
