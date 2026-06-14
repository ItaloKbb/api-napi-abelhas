import { z } from 'zod';
import { createTipoAmostraSchema } from './create-tipo-amostra.dto';

export const updateTipoAmostraSchema = createTipoAmostraSchema.partial();

export type UpdateTipoAmostraDto = z.infer<typeof updateTipoAmostraSchema>;
