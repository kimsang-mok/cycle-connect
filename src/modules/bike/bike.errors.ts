import { HttpStatus } from '@nestjs/common';
import { defineDomainError } from '@src/libs/exceptions/define-domain-error';

export const BikeNotAvailableError = defineDomainError({
  message: 'Bike is not available at this moment',
  code: 'BIKE.NOT_AVAILABLE',
  status: HttpStatus.CONFLICT,
});

export const BikeInactiveError = defineDomainError({
  message: 'Bike is currently inactive or under maintenance',
  code: 'BIKE.INACTIVE',
  status: HttpStatus.CONFLICT,
});

export const BikeOwnershipError = defineDomainError({
  message: 'You do not own this bike',
  code: 'BIKE.FORBIDDEN_OWNERSHIP',
  status: HttpStatus.FORBIDDEN,
});
