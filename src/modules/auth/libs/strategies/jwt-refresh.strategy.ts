import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { JwtRefreshPayloadType } from './types/jwt-refresh-payload';

import { Request } from 'express';
import { authConfig } from '@src/configs/auth.config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: (request: Request) => {
        let token = null;
        if (request && request.cookies) {
          token = request.cookies['jwt'];
        }

        return token;
      },
      secretOrKey: authConfig.refreshSecret,
    });
  }
  public validate(payload: JwtRefreshPayloadType): JwtRefreshPayloadType {
    if (!payload.id) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
