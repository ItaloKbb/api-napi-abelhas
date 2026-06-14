import { z } from 'zod';
import { createAnaliseSchema } from './create-analise.dto';

export const updateAnaliseSchema = createAnaliseSchema.partial();

export type UpdateAnaliseDto = z.infer<typeof updateAnaliseSchema>;
