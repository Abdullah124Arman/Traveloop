import { z } from 'zod';

export const createTripSchema = z.object({
  name: z.string().min(1).max(100),
  place: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  coverPhotoUrl: z.string().optional(),
  totalBudget: z.number().positive().optional(),
});

export const updateTripSchema = createTripSchema.partial().extend({
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED']).optional(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'PARTIAL']).optional(),
});
