import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { Err, Ok, Result } from 'oxide.ts';
import { AggregateId } from '@src/libs/ddd';
import { UserAlreadyExistsError } from '../../user.errors';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../user.di-tokens';
import { UserRepositoryPort } from '../../database/ports/user.repository.port';
import { UserEntity } from '../../domain/user.entity';
import { ConflictException } from '@src/libs/exceptions';
import { Email } from '../../value-objects/email.value-object';
import { PhoneNumber } from '../../value-objects/phone-number.value-object';
import { Password } from '../../value-objects/password.value-object';

@CommandHandler(CreateUserCommand)
export class CreateUserService
  implements
    ICommandHandler<
      CreateUserCommand,
      Result<AggregateId, UserAlreadyExistsError>
    >
{
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(
    command: CreateUserCommand,
  ): Promise<Result<AggregateId, UserAlreadyExistsError>> {
    const hashedPassword = await Password.create(command.password);

    const user = UserEntity.create({
      ...(command.email && { email: new Email(command.email) }),
      ...(command.phone && { phone: new PhoneNumber(command.phone) }),
      password: hashedPassword,
      role: command.role,
    });

    try {
      /* Wrapping operation in a transaction to make sure
         that all domain events are processed atomically */
      await this.userRepo.transaction(async () => this.userRepo.insert(user));
      return Ok(user.id);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new UserAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
