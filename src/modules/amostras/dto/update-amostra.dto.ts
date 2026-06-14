import { z } from 'zod';
import { createAmostraSchema } from './create-amostra.dto';

export const updateAmostraSchema = createAmostraSchema.partial();

export type UpdateAmostraDto = z.infer<typeof updateAmostraSchema>;
