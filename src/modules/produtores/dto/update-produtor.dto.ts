import { z } from 'zod';
import { createProdutorSchema } from './create-produtor.dto';

export const updateProdutorSchema = createProdutorSchema.partial();

export type UpdateProdutorDto = z.infer<typeof updateProdutorSchema>;
