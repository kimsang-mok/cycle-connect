import { HttpStatus } from '@nestjs/common';
import { defineDomainError } from '@src/libs/exceptions/define-domain-error';

export const CannotCancelBookingError = defineDomainError({
  message: 'Cannot cancel a completed or already cancelled booking',
  code: 'BOOKING.CANNOT_CANCEL',
  status: HttpStatus.CONFLICT,
});

export const CannotCompleteUnconfirmedBookingError = defineDomainError({
  message: 'Only confirmed bookings can be completed',
  code: 'BOOKING.NOT_CONFIRMED',
  status: HttpStatus.CONFLICT,
});
