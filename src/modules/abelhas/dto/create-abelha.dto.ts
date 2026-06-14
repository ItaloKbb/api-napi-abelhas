import { z } from 'zod';

export const createAbelhaSchema = z.object({
  nomeCientifico: z.string().min(1),
  nomePopular: z.string().optional(),
  semFerrao: z.boolean().default(true),
  nativa: z.boolean().default(true),
  descricao: z.string().optional(),
});

export type CreateAbelhaDto = z.infer<typeof createAbelhaSchema>;
