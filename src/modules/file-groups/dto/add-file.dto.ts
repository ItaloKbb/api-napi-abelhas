import { z } from 'zod';

export const addFileSchema = z.object({
  url: z.string().min(1),
  type: z.enum(['IMAGE', 'TEXTO', 'PDF', 'OUTROS']).default('IMAGE'),
  uploadedByUserId: z.string().optional(),
  uploadedByName: z.string().optional(),
});

export type AddFileDto = z.infer<typeof addFileSchema>;
