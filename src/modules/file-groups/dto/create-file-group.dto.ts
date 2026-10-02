import { z } from 'zod';

export const createFileGroupSchema = z
  .object({
    amostraId: z.string().uuid().optional(),
    analiseId: z.string().uuid().optional(),
    abelhaId: z.string().uuid().optional(),
  })
  .refine((data) => data.amostraId || data.analiseId || data.abelhaId, {
    message: 'At least one entity id must be provided',
  });

export type CreateFileGroupDto = z.infer<typeof createFileGroupSchema>;
