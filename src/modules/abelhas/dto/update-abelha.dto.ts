import { z } from 'zod';
import { createAbelhaSchema } from './create-abelha.dto';

export const updateAbelhaSchema = createAbelhaSchema.partial();

export type UpdateAbelhaDto = z.infer<typeof updateAbelhaSchema>;
