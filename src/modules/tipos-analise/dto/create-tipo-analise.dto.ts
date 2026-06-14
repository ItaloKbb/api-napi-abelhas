import { z } from 'zod';

export const createTipoAnaliseSchema = z.object({
  nome: z.string().min(1),
});

export type CreateTipoAnaliseDto = z.infer<typeof createTipoAnaliseSchema>;
