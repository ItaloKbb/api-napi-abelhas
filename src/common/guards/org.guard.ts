import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { ClerkUser } from '@/auth/strategies/clerk-jwt.strategy';

@Injectable()
export class OrgGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: ClerkUser }>();
    const orgId = request.user?.org_id;

    if (!orgId) {
      throw new ForbiddenException('Organização ativa necessária');
    }

    return true;
  }
}
