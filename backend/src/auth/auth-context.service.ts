import { ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedUser } from './auth.types.js';

@Injectable()
export class AuthContextService {
  private readonly logger = new Logger(AuthContextService.name);
  private currentUser: AuthenticatedUser | null = null;

  setCurrentUser(user: AuthenticatedUser | null) {
    this.currentUser = user;
  }

  getCurrentUser(): AuthenticatedUser | null {
    return this.currentUser;
  }

  requireUser(): AuthenticatedUser {
    if (!this.currentUser) {
      throw new UnauthorizedException('UNAUTHENTICATED');
    }
    return this.currentUser;
  }

  assertTenantAccess(tenantId: string, user: AuthenticatedUser = this.requireUser()) {
    if (user.tenantId !== tenantId) {
      this.logger.warn(`Tenant mismatch for user ${user.id}: expected ${tenantId}, received ${user.tenantId}`);
      throw new ForbiddenException('TENANT_ACCESS_DENIED');
    }
  }

  assertHubAccess(hubId: string, user: AuthenticatedUser = this.requireUser()) {
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      return;
    }

    if (!user.hubId || user.hubId !== hubId) {
      throw new ForbiddenException('HUB_ACCESS_DENIED');
    }
  }

  assertRiderOwnership(riderProfileId: string, user: AuthenticatedUser = this.requireUser()) {
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      return;
    }

    if (user.role !== 'RIDER') {
      throw new ForbiddenException('FORBIDDEN');
    }

    if (!user.riderProfileId || user.riderProfileId !== riderProfileId) {
      throw new ForbiddenException('RIDER_PROFILE_NOT_ACCESSIBLE');
    }
  }

  assertRole(allowedRoles: string[], user: AuthenticatedUser = this.requireUser()) {
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('FORBIDDEN');
    }
  }
}
