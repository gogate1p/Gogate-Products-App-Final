var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthContextService } from './auth-context.service.js';
import { AuthService } from './auth.service.js';
let AuthGuard = class AuthGuard {
    authContext;
    authService;
    constructor(authContext, authService) {
        this.authContext = authContext;
        this.authService = authService;
    }
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const authorization = req?.headers?.authorization ?? req?.get?.('authorization') ?? req?.auth ?? req?.session?.user?.authorization;
        if (!authorization || typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
            throw new UnauthorizedException('UNAUTHENTICATED');
        }
        try {
            const user = this.authService.verifyAccessToken(authorization);
            if (!user?.id || !user?.tenantId || !user?.role) {
                throw new UnauthorizedException('UNAUTHENTICATED');
            }
            this.authContext.setCurrentUser(user);
            req.user = user;
            return true;
        }
        catch {
            throw new UnauthorizedException('UNAUTHENTICATED');
        }
    }
};
AuthGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AuthContextService,
        AuthService])
], AuthGuard);
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map