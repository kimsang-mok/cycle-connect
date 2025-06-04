import { defineDomainError } from '@src/libs/exceptions/define-domain-error';
import { HttpStatus } from '@nestjs/common';

export const InvalidCredentialError = defineDomainError({
  message: 'Credential is invalid',
  code: 'AUTH.INVALID_CREDENTIAL',
  status: HttpStatus.UNAUTHORIZED,
});

export const AccountNotVerifiedError = defineDomainError({
  message: 'Account is not verified',
  code: 'AUTH.ACCOUNT_NOT_VERIFIED',
  status: HttpStatus.FORBIDDEN,
});

export const InvalidVerificationCodeError = defineDomainError({
  message: 'Verification code is invalid',
  code: 'AUTH.INVALID_VERIFICATION_CODE',
  status: HttpStatus.BAD_REQUEST,
});

export const UserAlreadyVerifiedError = defineDomainError({
  message: 'User is already verified',
  code: 'AUTH.USER_ALREADY_VERIFIED',
  status: HttpStatus.CONFLICT,
});

export const UserVerificationMismatchError = defineDomainError({
  message: 'Verification attempted by a mismatched user',
  code: 'AUTH.VERIFICATION_MISMATCH',
  status: HttpStatus.FORBIDDEN,
});

export const UserVerificationCodeExpiredError = defineDomainError({
  message: 'Verification code has expired',
  code: 'AUTH.VERIFICATION_CODE_EXPIRED',
  status: HttpStatus.GONE, // 410 Gone = resource was valid but is no longer available
});
