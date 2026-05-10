import { z } from 'zod';

export const createNoteSchema = z.object({
  stopId: z.string().uuid().optional(),
  title: z.string().max(200).optional(),
  content: z.string().min(1),
  dayNumber: z.number().int().positive().optional(),
});

export const updateNoteSchema = createNoteSchema.partial();
