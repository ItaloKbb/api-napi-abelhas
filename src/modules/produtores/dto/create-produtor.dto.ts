import { z } from 'zod';

export const createProdutorSchema = z.object({
  nome: z.string().min(1),
  cidadeId: z.string().uuid().optional(),
});

export type CreateProdutorDto = z.infer<typeof createProdutorSchema>;
