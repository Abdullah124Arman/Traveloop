import { z } from 'zod';

export const createStopSchema = z.object({
  cityId: z.string().uuid().optional(),
  description: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  sectionBudget: z.number().nonnegative().optional(),
  orderIndex: z.number().int().optional(),
});

export const updateStopSchema = createStopSchema.partial();

export const reorderStopsSchema = z.object({
  stops: z.array(z.object({ id: z.string().uuid(), orderIndex: z.number().int() })),
});
