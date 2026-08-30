var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AuthContextService_1;
import { ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
let AuthContextService = AuthContextService_1 = class AuthContextService {
    logger = new Logger(AuthContextService_1.name);
    currentUser = null;
    setCurrentUser(user) {
        this.currentUser = user;
    }
    getCurrentUser() {
        return this.currentUser;
    }
    requireUser() {
        if (!this.currentUser) {
            throw new UnauthorizedException('UNAUTHENTICATED');
        }
        return this.currentUser;
    }
    assertTenantAccess(tenantId, user = this.requireUser()) {
        if (user.tenantId !== tenantId) {
            this.logger.warn(`Tenant mismatch for user ${user.id}: expected ${tenantId}, received ${user.tenantId}`);
            throw new ForbiddenException('TENANT_ACCESS_DENIED');
        }
    }
    assertHubAccess(hubId, user = this.requireUser()) {
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
            return;
        }
        if (!user.hubId || user.hubId !== hubId) {
            throw new ForbiddenException('HUB_ACCESS_DENIED');
        }
    }
    assertRiderOwnership(riderProfileId, user = this.requireUser()) {
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
    assertRole(allowedRoles, user = this.requireUser()) {
        if (!allowedRoles.includes(user.role)) {
            throw new ForbiddenException('FORBIDDEN');
        }
    }
};
AuthContextService = AuthContextService_1 = __decorate([
    Injectable()
], AuthContextService);
export { AuthContextService };
//# sourceMappingURL=auth-context.service.js.map