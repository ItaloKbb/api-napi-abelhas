import { z } from 'zod';

export const createAnaliseSchema = z.object({
  amostraId: z.string().uuid(),
  tipoAnaliseId: z.string().uuid(),
  responsavelId: z.string().uuid(),
  status: z
    .enum([
      'PENDENTE',
      'EM_PREPARO',
      'AGUARDANDO_RESULTADO',
      'EM_REVISAO',
      'CONCLUIDA',
      'REJEITADA',
    ])
    .optional(),
});

export type CreateAnaliseDto = z.infer<typeof createAnaliseSchema>;
