import { UserRoles } from '../domain/user.types';
import { z } from 'zod';

/**
 * Runtime validation of user object for extra safety (in case database schema changes).
 * https://github.com/gajus/slonik#runtime-validation
 * If you prefer to avoid performance penalty of validation, use interfaces instead.
 */
export const userSchema = z.object({
  id: z.string().uuid().refine(Boolean),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRoles),
});

export type UserModel = z.TypeOf<typeof userSchema>;
