import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import type { ClerkUser } from '@/auth/strategies/clerk-jwt.strategy';

export const OrgId = createParamDecorator(
  (_data: undefined, ctx: ExecutionContext): string => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: ClerkUser }>();
    const orgId = request.user?.org_id;
    if (!orgId) {
      throw new ForbiddenException('Organização ativa necessária');
    }
    return orgId;
  },
);
