import { z } from 'zod';

export const createPontoColetaSchema = z.object({
  nome: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  raio: z.number().optional(),
  cidadeId: z.string().uuid(),
});

export type CreatePontoColetaDto = z.infer<typeof createPontoColetaSchema>;
