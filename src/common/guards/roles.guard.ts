import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';

interface AuthenticatedUser {
  org_role?: string;
}

/**
 * Normalizes a Clerk organization role (e.g. "org:admin") to a plain
 * upper-case string ("ADMIN") so it can be compared against the values
 * used in @Roles() decorators.
 */
function normalizeRole(role: string | undefined): string | undefined {
  if (!role) return undefined;
  const stripped = role.startsWith('org:') ? role.slice(4) : role;
  return stripped.toUpperCase();
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: AuthenticatedUser }>();
    const user = request.user;

    const orgRole = normalizeRole(user?.org_role);

    return requiredRoles.some((role) => orgRole === role.toUpperCase());
  }
}
