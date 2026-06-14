import { z } from 'zod';

export const createResponsavelSchema = z.object({
  nome: z.string().min(1),
  instituicaoId: z.string().min(1),
  cidadeId: z.string().uuid().optional(),
});

export type CreateResponsavelDto = z.infer<typeof createResponsavelSchema>;
