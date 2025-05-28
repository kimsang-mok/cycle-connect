import { z } from 'zod';
import { BookingStatus } from '../domain/booking.types';

export const bookingSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  bikeId: z.string().uuid(),
  customerId: z.string().uuid(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.nativeEnum(BookingStatus),
  totalPrice: z.number(),
});

export type BookingModel = z.TypeOf<typeof bookingSchema>;
