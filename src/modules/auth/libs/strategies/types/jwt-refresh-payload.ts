import { UserModel } from '@src/modules/user/database/user.schema';

export type JwtRefreshPayloadType = {
  id: UserModel['id'];
  refreshToken: string;
  iat: number;
  exp: number;
};
