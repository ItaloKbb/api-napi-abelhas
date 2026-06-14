import { z } from 'zod';

export const queryCidadesIbgeSchema = z.object({
  estado: z.string().optional(),
  regiao: z.string().optional(),
  bioma: z.string().optional(),
});

export type QueryCidadesIbgeDto = z.infer<typeof queryCidadesIbgeSchema>;
