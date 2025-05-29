import { z } from 'zod';

export const userVerificationSchema = z.object({
  id: z.string().uuid().refine(Boolean),
  expiresAt: z.coerce.date(),
  target: z.string(),
  userId: z.string().uuid().refine(Boolean),
  token: z.string(),
  verified: z.boolean(),
  createdAt: z.coerce.date(),
});

export type UserVerificationModel = z.TypeOf<typeof userVerificationSchema>;
