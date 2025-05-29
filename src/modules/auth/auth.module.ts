import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { CookiesService } from './libs/cookies/cookies.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './libs/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './libs/strategies/jwt-refresh.strategy';
import {
  SESSION_REPOSITORY,
  USER_VERIFICATION_REPOSITORY,
} from './auth.di-tokens';
import { UserVerificationRepository } from './database/adapters/user-verification.repository';
import { SessionRepository } from './database/adapters/session.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { CreateUserVerificationWhenUserIsCreatedDomainEventHandler } from './event-handlers/create-user-verification-when-user-is-created.domain-event-handler';
import { AuthenticateUserService } from './services/authenticate-user.service';
import { SessionService } from './services/session.service';
import { UserVerificationMapper } from './user-verification.mapper';
import { SessionMapper } from './session.mapper';

const controllers = [AuthController];

const services: Provider[] = [
  AuthService,
  CookiesService,
  AuthenticateUserService,
  SessionService,
];

const commandHandlers: Provider[] = [];

const eventHandlers: Provider[] = [
  CreateUserVerificationWhenUserIsCreatedDomainEventHandler,
];

const strategies: Provider[] = [JwtStrategy, JwtRefreshStrategy];

const repositories: Provider[] = [
  {
    provide: USER_VERIFICATION_REPOSITORY,
    useClass: UserVerificationRepository,
  },
  {
    provide: SESSION_REPOSITORY,
    useClass: SessionRepository,
  },
];

const mappers: Provider[] = [UserVerificationMapper, SessionMapper];

@Module({
  imports: [CqrsModule, UserModule, PassportModule, JwtModule.register({})],
  controllers: [...controllers],
  providers: [
    Logger,
    ...services,
    ...strategies,
    ...commandHandlers,
    ...eventHandlers,
    ...repositories,
    ...mappers,
  ],
  exports: [],
})
export class AuthModule {}
