import { z } from 'zod';

export const queryFileGroupsSchema = z.object({
  amostraId: z.string().uuid().optional(),
  analiseId: z.string().uuid().optional(),
  abelhaId: z.string().uuid().optional(),
});

export type QueryFileGroupsDto = z.infer<typeof queryFileGroupsSchema>;
