import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from './login-user.command';
import { Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import {
  USER_REPOSITORY,
  USER_VERIFICATION_REPOSITORY,
} from '@src/modules/user/user.di-tokens';
import { UserRepositoryPort } from '@src/modules/user/database/ports/user.repository.port';
import { UserNotFoundError } from '@src/modules/user/user.errors';
import {
  AccountNotVerifiedError,
  InvalidCredentialError,
} from '../../auth.errors';
import { AuthenticateUserHandler } from '../../handlers/authenticate-user.handler';
import { LoginUserResponseDto } from './login-user.response.dto';
import { UserMapper } from '@src/modules/user/user.mapper';
import { UserVerificationRepositoryPort } from '@src/modules/user/database/ports/user-verification.repository.port';

@CommandHandler(LoginUserCommand)
export class LoginUserService
  implements
    ICommandHandler<
      LoginUserCommand,
      Result<LoginUserResponseDto, UserNotFoundError | InvalidCredentialError>
    >
{
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepositoryPort,
    @Inject(USER_VERIFICATION_REPOSITORY)
    protected readonly userVerificationRepo: UserVerificationRepositoryPort,
    private readonly authenticateUserHandler: AuthenticateUserHandler,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(
    command: LoginUserCommand,
  ): Promise<
    Result<LoginUserResponseDto, UserNotFoundError | InvalidCredentialError>
  > {
    try {
      const user = await this.userRepo.findOneByEmail(command.email);

      if (!user) {
        throw new UserNotFoundError();
      }

      const match = await user.getProps().password.compare(command.password);

      if (!match) {
        throw new InvalidCredentialError();
      }

      const verification = await this.userVerificationRepo.findOneByUserId(
        user.id,
      );

      if (!verification?.getProps().verified) {
        throw new AccountNotVerifiedError();
      }

      const tokenData = await this.authenticateUserHandler.handle({
        user,
        cookies: command.cookies,
      });

      return Ok({ user: this.userMapper.toResponse(user), ...tokenData });
    } catch (error) {
      throw error;
    }
  }
}
