import { z } from 'zod';
import { createResponsavelSchema } from './create-responsavel.dto';

export const updateResponsavelSchema = createResponsavelSchema.partial();

export type UpdateResponsavelDto = z.infer<typeof updateResponsavelSchema>;
