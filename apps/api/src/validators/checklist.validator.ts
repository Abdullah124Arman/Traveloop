import { z } from 'zod';

export const addChecklistItemSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.enum(['ESSENTIALS', 'CLOTHING', 'ELECTRONICS', 'MISC']),
});

export const updateChecklistItemSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  category: z.enum(['ESSENTIALS', 'CLOTHING', 'ELECTRONICS', 'MISC']).optional(),
  isPacked: z.boolean().optional(),
});
