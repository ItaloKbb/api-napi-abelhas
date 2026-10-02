import { z } from 'zod';

const statusAmostraSchema = z.enum([
  'PENDENTE',
  'EM_ANALISE',
  'CONCLUIDA',
  'REJEITADA',
]);

export const createAmostraSchema = z.object({
  nome: z.string().min(1),
  dataColeta: z.coerce.date(),
  pontoColetaId: z.string().uuid(),
  abelhaId: z.string().uuid(),
  produtorId: z.string().uuid(),
  tipoAmostraId: z.string().uuid(),
  status: statusAmostraSchema.optional(),
});

export type CreateAmostraDto = z.infer<typeof createAmostraSchema>;
