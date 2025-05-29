import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { AggregateId } from '@src/libs/ddd';
import { UserAlreadyExistsError } from '../../user.errors';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../user.di-tokens';
import { UserRepositoryPort } from '../../database/ports/user.repository.port';
import { UserEntity } from '../../domain/user.entity';
import { ConflictException } from '@src/libs/exceptions';
import { Email } from '../../domain/value-objects/email.value-object';
import { Password } from '../../domain/value-objects/password.value-object';

@CommandHandler(CreateUserCommand)
export class CreateUserService
  implements ICommandHandler<CreateUserCommand, AggregateId>
{
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<AggregateId> {
    const hashedPassword = await Password.create(command.password);

    const user = UserEntity.create({
      email: new Email(command.email),
      password: hashedPassword,
      role: command.role,
    });

    try {
      /* Wrapping operation in a transaction to make sure
         that all domain events are processed atomically */
      await this.userRepo.transaction(async () => this.userRepo.insert(user));
      return user.id;
    } catch (error: any) {
      if (error instanceof ConflictException) {
        throw new UserAlreadyExistsError(error);
      }
      throw error;
    }
  }
}
