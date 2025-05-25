import { Logger, Module, Provider } from '@nestjs/common';
import { UserRepository } from './database/adapters/user.repository';

import { CreateUserService } from './commands/create-user/create-user.service';

import { UserMapper } from './user.mapper';
import { CqrsModule } from '@nestjs/cqrs';
import {
  USER_REPOSITORY,
  USER_VERIFICATION_REPOSITORY,
} from './user.di-tokens';
import { UserVerificationRepository } from './database/adapters/user-verification.repository';
import { CreateUserVerificationWhenUserIsCreatedDomainEventHandler } from './event-handlers/create-user-verification-when-user-is-created.domain-event-handler';
import { UserVerificationMapper } from './user-verification.mapper';
import { FindUsersQueryHandler } from './queries/find-users/find-users.query-handler';
import { FindUsersController } from './queries/find-users/find-users.controller';

const controllers = [FindUsersController];

const commandHandlers: Provider[] = [CreateUserService];

const queryHandlers: Provider[] = [FindUsersQueryHandler];

const eventHandlers: Provider[] = [
  CreateUserVerificationWhenUserIsCreatedDomainEventHandler,
];

const mappers: Provider[] = [UserMapper, UserVerificationMapper];

const repositories: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },
  {
    provide: USER_VERIFICATION_REPOSITORY,
    useClass: UserVerificationRepository,
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [...controllers],
  providers: [
    Logger,
    ...eventHandlers,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
  exports: [USER_REPOSITORY, USER_VERIFICATION_REPOSITORY, UserMapper],
})
export class UserModule {}
