import { z } from 'zod';

export const updateFileGroupSchema = z.object({
  amostraId: z.string().uuid().optional(),
  analiseId: z.string().uuid().optional(),
});

export type UpdateFileGroupDto = z.infer<typeof updateFileGroupSchema>;
