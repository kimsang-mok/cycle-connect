import { UserModel } from '@src/modules/user/database/adapters/user.repository';

export type JwtPayloadType = Pick<UserModel, 'id' | 'role'> & {
  iat: number;
  exp: number;
};
