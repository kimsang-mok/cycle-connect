import { Logger, Module, Provider } from '@nestjs/common';
import { UserRepository } from './database/adapters/user.repository';
import { CreateUserService } from './commands/create-user/create-user.service';
import { UserMapper } from './user.mapper';
import { CqrsModule } from '@nestjs/cqrs';
import { USER_REPOSITORY } from './user.di-tokens';
import { FindUsersQueryHandler } from './queries/find-users/find-users.query-handler';
import { FindUsersController } from './queries/find-users/find-users.controller';

const controllers = [FindUsersController];

const commandHandlers: Provider[] = [CreateUserService];

const queryHandlers: Provider[] = [FindUsersQueryHandler];

const eventHandlers: Provider[] = [];

const mappers: Provider[] = [UserMapper];

const repositories: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
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
  exports: [USER_REPOSITORY, UserMapper],
})
export class UserModule {}
