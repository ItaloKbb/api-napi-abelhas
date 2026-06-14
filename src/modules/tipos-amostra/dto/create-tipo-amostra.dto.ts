import { z } from 'zod';

export const createTipoAmostraSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().optional(),
});

export type CreateTipoAmostraDto = z.infer<typeof createTipoAmostraSchema>;
