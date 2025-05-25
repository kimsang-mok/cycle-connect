import { UserModel } from '@src/modules/user/database/adapters/user.repository';

export type JwtRefreshPayloadType = {
  id: UserModel['id'];
  refreshToken: string;
  iat: number;
  exp: number;
};
