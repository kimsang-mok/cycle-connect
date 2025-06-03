import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRoles } from '@src/modules/user/domain/user.types';

export class MockJwtAuthGuard implements CanActivate {
  static user = {
    id: '84b34736-2cf5-4a12-81e2-d58cbb0701ec',
    role: UserRoles.renter,
  };

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = MockJwtAuthGuard.user;
    return true;
  }
}
