import { z } from 'zod';

export const addStopActivitySchema = z.object({
  activityId: z.string().uuid().optional(),
  scheduledTime: z.string().optional(),
  customCost: z.number().nonnegative().optional(),
  notes: z.string().optional(),
  orderIndex: z.number().int().optional(),
});

export const createCommunityPostSchema = z.object({
  content: z.string().min(1),
  tripId: z.string().uuid().optional(),
});

export const updateInvoiceSchema = z.object({
  paymentStatus: z.enum(['PENDING', 'PAID', 'PARTIAL']).optional(),
  subtotal: z.number().nonnegative().optional(),
  tax: z.number().nonnegative().optional(),
  grandTotal: z.number().nonnegative().optional(),
  items: z.array(z.object({
    id: z.string().uuid().optional(),
    category: z.string().min(1),
    description: z.string().min(1),
    quantity: z.number().int().positive().optional(),
    unitCost: z.number().nonnegative(),
    amount: z.number().nonnegative(),
    orderIndex: z.number().int().optional(),
  })).optional(),
});

export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  additionalInfo: z.string().optional(),
  photoUrl: z.string().optional(),
});
