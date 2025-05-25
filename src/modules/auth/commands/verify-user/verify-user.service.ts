import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyUserCommand } from './verify-user.command';
import { Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import {
  USER_REPOSITORY,
  USER_VERIFICATION_REPOSITORY,
} from '@src/modules/user/user.di-tokens';
import { UserVerificationRepositoryPort } from '@src/modules/user/database/ports/user-verification.repository.port';
import { NotFoundException } from '@src/libs/exceptions';
import { AuthenticateUserHandler } from '../../handlers/authenticate-user.handler';
import { UserRepository } from '@src/modules/user/database/adapters/user.repository';
import { UserMapper } from '@src/modules/user/user.mapper';
import { LoginUserResponseDto } from '../login-user/login-user.response.dto';

@CommandHandler(VerifyUserCommand)
export class VerifyUserService
  implements
    ICommandHandler<VerifyUserCommand, Result<LoginUserResponseDto, Error>>
{
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepository,
    @Inject(USER_VERIFICATION_REPOSITORY)
    protected readonly userVerificationRepo: UserVerificationRepositoryPort,
    protected readonly userMapper: UserMapper,
    protected readonly authenticateUserHandler: AuthenticateUserHandler,
  ) {}

  async execute(
    command: VerifyUserCommand,
  ): Promise<Result<LoginUserResponseDto, NotFoundException | Error>> {
    try {
      return this.userVerificationRepo.transaction(async () => {
        const verification = await this.userVerificationRepo.findOneByCode(
          command.code,
        );

        if (!verification) {
          throw new NotFoundException('Verification code not found');
        }

        verification.verify(command.code);

        this.userVerificationRepo.markAsVerified(verification.id);

        const maybeUser = await this.userRepo.findOneById(
          verification.getProps().userId,
        );

        if (maybeUser.isNone()) {
          throw new NotFoundException('User not found');
        }

        const user = maybeUser.unwrap();

        const tokenData = await this.authenticateUserHandler.handle({
          user,
          cookies: command.cookies,
        });

        return Ok({ user: this.userMapper.toResponse(user), ...tokenData });
      });
    } catch (error) {
      throw error;
    }
  }
}
