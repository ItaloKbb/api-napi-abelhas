import { z } from 'zod';

export const createAmostraSchema = z.object({
  nome: z.string().min(1),
  dataColeta: z.coerce.date(),
  pontoColetaId: z.string().uuid(),
  abelhaId: z.string().uuid(),
  produtorId: z.string().uuid(),
  tipoAmostraId: z.string().uuid(),
});

export type CreateAmostraDto = z.infer<typeof createAmostraSchema>;
