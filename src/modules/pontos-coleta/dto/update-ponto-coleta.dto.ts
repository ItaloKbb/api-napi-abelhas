import { z } from 'zod';
import { createPontoColetaSchema } from './create-ponto-coleta.dto';

export const updatePontoColetaSchema = createPontoColetaSchema.partial();

export type UpdatePontoColetaDto = z.infer<typeof updatePontoColetaSchema>;
