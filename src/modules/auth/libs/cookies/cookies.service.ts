import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ICookiesServive } from './interfaces/cookies-services';
import { Response } from 'express';
import { authConfig } from '@src/configs/auth.config';

@Injectable()
export class CookiesService implements ICookiesServive {
  constructor() {}

  signCookie(res: Response, refreshToken: string): void {
    const maxAge =
      parseInt(authConfig.cookiesExpires ?? '30') * 24 * 60 * 60 * 1000;

    res.cookie('jwt', refreshToken, {
      httpOnly: true, // to prevent XSS attacts
      secure: false,
      sameSite: 'lax',
      maxAge,
    });
  }

  clearCookie(res: Response): void {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
  }

  checkCookie(cookies: { jwt?: string }): string {
    if (!cookies?.jwt) {
      throw new UnauthorizedException();
    }

    return cookies.jwt;
  }
}
