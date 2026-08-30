var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ForbiddenException, Injectable } from '@nestjs/common';
let AuthPolicyService = class AuthPolicyService {
    assertTenantAccess(user, tenantId) {
        if (user.tenantId !== tenantId) {
            throw new ForbiddenException('TENANT_ACCESS_DENIED');
        }
    }
    assertHubAccess(user, hubId) {
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
            return;
        }
        if (!user.hubId || user.hubId !== hubId) {
            throw new ForbiddenException('HUB_ACCESS_DENIED');
        }
    }
    assertRiderOwnership(user, riderProfileId) {
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
};
AuthPolicyService = __decorate([
    Injectable()
], AuthPolicyService);
export { AuthPolicyService };
//# sourceMappingURL=auth-policy.service.js.map