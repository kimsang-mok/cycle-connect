import { z } from 'zod';

export const sessionSchema = z.object({
  id: z.string().uuid().refine(Boolean),
  userId: z.string().uuid().refine(Boolean),
  accessToken: z.string(),
  refreshToken: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type SessionModel = z.TypeOf<typeof sessionSchema>;
