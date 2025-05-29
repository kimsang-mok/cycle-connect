import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authConfig } from '@src/configs/auth.config';
import { UserEntity } from '@src/modules/user/domain/user.entity';
import { SessionService } from './session.service';

@Injectable()
export class AuthenticateUserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async handle({
    cookies,
    user,
  }: {
    cookies: { jwt?: string };
    user: UserEntity;
  }) {
    const { token, refreshToken } = await this.getTokensData({
      id: user.id,
      role: user.role,
    });

    if (cookies?.jwt) {
      /**
       * if cookies contains jwt, and the jwt has been stored in Session table,
       * delete that session and create a new one
       */
      await this.sessionService.deleteByRefreshToken({
        refreshToken: cookies.jwt,
      });
    }

    await this.sessionService.create({
      userId: user.id,
      accessToken: token,
      refreshToken,
    });

    return { token, refreshToken };
  }

  async getTokensData({
    id,
    role,
  }: {
    id: UserEntity['id'];
    role: UserEntity['role'];
  }) {
    const tokenExpiresIn = authConfig.expires;

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: id,
          role: role,
        },
        {
          secret: authConfig.secret,
          expiresIn: tokenExpiresIn,
        },
      ),

      await this.jwtService.signAsync(
        {
          id: id,
        },
        {
          secret: authConfig.refreshSecret,
          expiresIn: authConfig.refreshExpires,
        },
      ),
    ]);

    return { token, refreshToken };
  }
}
