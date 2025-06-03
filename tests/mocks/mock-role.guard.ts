import { CanActivate } from '@nestjs/common';

export class MockRolesGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}
