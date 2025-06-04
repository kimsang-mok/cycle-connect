import { HttpStatus } from '@nestjs/common';

import { defineDomainError } from '@src/libs/exceptions/define-domain-error';

export const UserAlreadyExistsError = defineDomainError({
  message: 'User already exists',
  code: 'USER.ALREADY_EXISTS',
  status: HttpStatus.CONFLICT,
});

export const UserNotFoundError = defineDomainError({
  message: 'User not found',
  code: 'USER.NOT_FOUND',
  status: HttpStatus.NOT_FOUND,
});
