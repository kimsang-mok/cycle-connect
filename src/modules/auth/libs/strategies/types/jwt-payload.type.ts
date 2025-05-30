import { UserModel } from '@src/modules/user/database/user.schema';

export type JwtPayloadType = Pick<UserModel, 'id' | 'role'> & {
  iat: number;
  exp: number;
};
