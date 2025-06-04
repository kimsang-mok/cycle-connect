import { JwtService } from '@nestjs/jwt';
import { JwtRefreshPayloadType } from '../libs/strategies/types/jwt-refresh-payload';
import { LoginUserResponseDto } from '../dtos/login-user.response.dto';
import { AuthenticateUserService } from './authenticate-user.service';
import { SessionService } from './session.service';
import { UserRepositoryPort } from '../../user/database/ports/user.repository.port';
import { Inject, UnprocessableEntityException } from '@nestjs/common';
import { UserMapper } from '@src/modules/user/user.mapper';
import { authConfig } from '@src/configs/auth.config';
import { USER_REPOSITORY } from '@src/modules/user/user.di-tokens';
import { USER_VERIFICATION_REPOSITORY } from '../auth.di-tokens';
import { UserVerificationRepositoryPort } from '../database/ports/user-verification.repository.port';
import { LoginUserRequestDto } from '../dtos/login-user.request.dto';
import { UserNotFoundError } from '@src/modules/user/user.errors';
import {
  AccountNotVerifiedError,
  InvalidCredentialError,
} from '../auth.errors';
import { NotFoundException } from '@src/libs/exceptions';

export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
    private readonly userMapper: UserMapper,
    @Inject(USER_VERIFICATION_REPOSITORY)
    private readonly userVerificationRepo: UserVerificationRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly authenticateUserService: AuthenticateUserService,
    private readonly sessionService: SessionService,
  ) {}

  async login(
    loginDto: LoginUserRequestDto,
    cookies: { jwt: string },
  ): Promise<LoginUserResponseDto> {
    const user = await this.userRepo.findOneByEmail(loginDto.email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const match = await user.getProps().password.compare(loginDto.password);

    if (!match) {
      throw new InvalidCredentialError();
    }

    const verification = await this.userVerificationRepo.findOneByUserId(
      user.id,
    );

    if (!verification?.getProps().verified) {
      throw new AccountNotVerifiedError();
    }

    const tokenData = await this.authenticateUserService.handle({
      user,
      cookies,
    });

    return { user: this.userMapper.toResponse(user), ...tokenData };
  }

  async confirmEmail(hash: string): Promise<LoginUserResponseDto> {
    return this.userVerificationRepo.transaction(async () => {
      let userId: string;

      try {
        const jwtData = await this.jwtService.verifyAsync<{
          confirmEmailUserId: string;
        }>(hash, {
          secret: authConfig.confirmEmailSecret,
        });
        userId = jwtData.confirmEmailUserId;
      } catch {
        throw new UnprocessableEntityException('Invalid hash');
      }

      const verification =
        await this.userVerificationRepo.findOneByUserId(userId);

      if (!verification) {
        throw new NotFoundException();
      }

      verification.verify(userId);

      this.userVerificationRepo.save(verification);

      const user = await this.userRepo.findOneById(userId);

      if (!user) {
        throw new UserNotFoundError();
      }

      const tokenData = await this.authenticateUserService.handle({
        user,
        cookies: { jwt: undefined },
      });

      return { user: this.userMapper.toResponse(user), ...tokenData };
    });
  }

  async refreshToken(
    _refreshToken: string,
    userId: JwtRefreshPayloadType['id'],
  ): Promise<LoginUserResponseDto> {
    const sesssion = await this.sessionService.verifySession(
      _refreshToken,
      userId,
    );

    const user = await this.userRepo.findOneById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const { token, refreshToken } =
      await this.authenticateUserService.getTokensData({
        id: userId,
        role: user.role,
      });

    await this.sessionService.update(sesssion.id, {
      accessToken: token,
      refreshToken,
    });

    return {
      user: this.userMapper.toResponse(user),
      token,
      refreshToken,
    };
  }
}
