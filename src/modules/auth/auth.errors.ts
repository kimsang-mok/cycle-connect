import { ExceptionBase } from '@src/libs/exceptions';

export class InvalidCredentialError extends ExceptionBase {
  static readonly message = 'Credential is invalid';

  public readonly code = 'AUTH.INVALID_CREDENTIAL';

  constructor(cause?: Error, metadata?: unknown) {
    super(InvalidCredentialError.message, cause, metadata);
  }
}

export class AccountNotVerifiedError extends ExceptionBase {
  static readonly message = 'Account is not verified';

  public readonly code = 'AUTH.ACCOUNT_NOT_VERIFIED';

  constructor(cause?: Error, metadata?: unknown) {
    super(AccountNotVerifiedError.message, cause, metadata);
  }
}

export class InvalidVerificationCodeError extends ExceptionBase {
  static readonly message = 'Verification code is invalid';

  public readonly code = 'AUTH.INVALID_VERIFICATION_CODE';

  constructor(cause?: Error, metadata?: unknown) {
    super(InvalidVerificationCodeError.message, cause, metadata);
  }
}
