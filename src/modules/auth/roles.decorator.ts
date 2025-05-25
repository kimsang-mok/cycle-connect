import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../user/domain/user.types';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
