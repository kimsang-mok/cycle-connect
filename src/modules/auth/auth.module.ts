import { Logger, Module, Provider } from '@nestjs/common';
import { RegisterUserController } from './commands/register-user/register-user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { LoginUserController } from './commands/login-user/login-user.controller';
import { AuthenticateUserHandler } from './handlers/authenticate-user.handler';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { CookiesService } from './libs/cookies/cookies.service';
import { LoginUserService } from './commands/login-user/login-user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './libs/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './libs/strategies/jwt-refresh.strategy';
import { VerifyUserController } from './commands/verify-user/verify-user.controller';
import { VerifyUserService } from './commands/verify-user/verify-user.service';

const commandHandlers: Provider[] = [LoginUserService, VerifyUserService];

const strategies = [JwtStrategy, JwtRefreshStrategy];

const controllers = [
  RegisterUserController,
  LoginUserController,
  VerifyUserController,
];

@Module({
  imports: [CqrsModule, UserModule, PassportModule, JwtModule.register({})],
  controllers: [...controllers],
  providers: [
    Logger,
    AuthenticateUserHandler,
    CookiesService,
    ...strategies,
    ...commandHandlers,
  ],
  exports: [],
})
export class AuthModule {}
