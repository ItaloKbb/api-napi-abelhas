import { z } from 'zod';
import { createTipoAnaliseSchema } from './create-tipo-analise.dto';

export const updateTipoAnaliseSchema = createTipoAnaliseSchema.partial();

export type UpdateTipoAnaliseDto = z.infer<typeof updateTipoAnaliseSchema>;
