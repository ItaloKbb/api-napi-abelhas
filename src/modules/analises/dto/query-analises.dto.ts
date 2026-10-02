import { z } from 'zod';

export const queryAnalisesSchema = z.object({
  amostraId: z.string().uuid().optional(),
  tipoAnaliseId: z.string().uuid().optional(),
  responsavelId: z.string().uuid().optional(),
});

export type QueryAnalisesDto = z.infer<typeof queryAnalisesSchema>;
