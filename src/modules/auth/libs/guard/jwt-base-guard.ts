/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function createJwtGuard(strategy: string) {
  return class extends AuthGuard(strategy) {
    constructor(strategy: string) {
      super(strategy);
    }

    /**
     * Override handleRequest to customize error messages for invalid JWT tokens.
     *
     * @param err - The error thrown during authentication
     * @param user - The user object if authentication succeeds
     * @param info - Additional information about the failure, e.g., token errors
     * @param context - The execution context (useful for additional processing)
     * @returns user - The authenticated user object
     */

    handleRequest(
      err: unknown,
      user: any,
      info: any,
      context?: ExecutionContext,
    ): any {
      if (err || !user) {
        if (info?.name === 'TokenExpiredError') {
          throw new UnauthorizedException(
            'The token has expired. Please log in again.',
          );
        } else if (info?.name === 'JsonWebTokenError') {
          throw new UnauthorizedException(
            'The token is invalid. Authentication failed.',
          );
        } else {
          throw new UnauthorizedException(
            'Authentication failed. Please provide a valid token.',
          );
        }
      }
      return user;
    }
  };
}
