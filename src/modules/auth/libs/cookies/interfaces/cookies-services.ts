import { Response } from 'express';

export interface ICookiesServive {
  /**
   * Signs a cookie with a refresh token.
   * @param res The Express response object.
   * @param refreshToken The refresh token to sign the cookie with.
   */
  signCookie(res: Response, refreshToken: string): void;

  /**
   * Clears the 'jwt' cookie from the response.
   * @param res The Express response object.
   */
  clearCookie(res: Response): void;

  /**
   * Checks for a 'jwt' cookie and returns its value.
   * @param cookies Object containing cookies from the request.
   * @returns The JWT string if present, otherwise throws an error.
   */
  checkCookie(cookies: { jwt?: string }): string;
}
