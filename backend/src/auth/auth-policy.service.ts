import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthenticatedUser } from './auth.types.js';

@Injectable()
export class AuthPolicyService {
  assertTenantAccess(user: AuthenticatedUser, tenantId: string) {
    if (user.tenantId !== tenantId) {
      throw new ForbiddenException('TENANT_ACCESS_DENIED');
    }
  }

  assertHubAccess(user: AuthenticatedUser, hubId: string) {
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      return;
    }

    if (!user.hubId || user.hubId !== hubId) {
      throw new ForbiddenException('HUB_ACCESS_DENIED');
    }
  }

  assertRiderOwnership(user: AuthenticatedUser, riderProfileId: string) {
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
}
