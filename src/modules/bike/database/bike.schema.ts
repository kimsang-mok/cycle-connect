import { z } from 'zod';
import { BikeTypes } from '../domain/bike.types';

export const bikeSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  type: z.nativeEnum(BikeTypes),
  model: z.string(),
  ownerId: z.string().uuid(),
  enginePower: z.number(),
  description: z.string(),
  pricePerDay: z.number(),
  isActive: z.boolean(),
});

export type BikeModel = z.TypeOf<typeof bikeSchema>;
