import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const signupSchema = z.object({
  email: z.email(),
  username: z.string().min(3).max(100),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  additionalInfo: z.string().optional(),
  photoUrl: z.string().optional(),
});
