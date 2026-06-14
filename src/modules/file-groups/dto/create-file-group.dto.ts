import { z } from 'zod';

export const createFileGroupSchema = z
  .object({
    amostraId: z.string().uuid().optional(),
    analiseId: z.string().uuid().optional(),
  })
  .refine((data) => data.amostraId || data.analiseId, {
    message: 'At least one of amostraId or analiseId must be provided',
  });

export type CreateFileGroupDto = z.infer<typeof createFileGroupSchema>;
