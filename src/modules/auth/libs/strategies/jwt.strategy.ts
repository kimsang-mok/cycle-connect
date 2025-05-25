import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayloadType } from './types/jwt-payload.type';
import { authConfig } from '@src/configs/auth.config';
import { Ok, Result } from 'oxide.ts';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfig.secret,
    });
  }

  // the reason as to why this code doesn't check if the user exits in db:
  // https://github.com/brocoders/nestjs-boilerplate/blob/main/docs/auth.md#about-jwt-strategy
  public validate(
    payload: JwtPayloadType,
  ): Result<JwtPayloadType, UnauthorizedException> {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    return Ok(payload);
  }
}
