var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
const jwtIssuer = process.env.JWT_ISSUER ?? 'gp-backend';
const jwtAudience = process.env.JWT_AUDIENCE ?? 'gp-app';
const jwtExpiresInRaw = process.env.JWT_EXPIRES_IN ?? '1h';
const jwtExpiresIn = /^\d+$/.test(jwtExpiresInRaw)
    ? Number(jwtExpiresInRaw)
    : jwtExpiresInRaw;
let AuthService = class AuthService {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    signAccessToken(user) {
        const payload = {
            sub: user.id,
            userId: user.id,
            tenantId: user.tenantId,
            role: user.role,
            hubId: user.hubId,
            riderProfileId: user.riderProfileId,
            email: user.email,
            name: user.name,
        };
        const options = {
            issuer: jwtIssuer,
            audience: jwtAudience,
            expiresIn: jwtExpiresIn,
        };
        return this.jwtService.sign(payload, options);
    }
    verifyAccessToken(authorization) {
        const token = authorization.replace(/^Bearer\s+/i, '').trim();
        const payload = this.jwtService.verify(token, {
            issuer: jwtIssuer,
            audience: jwtAudience,
        });
        if (!payload || !payload.userId || !payload.tenantId || !payload.role) {
            throw new Error('UNAUTHENTICATED');
        }
        return {
            id: payload.userId,
            tenantId: payload.tenantId,
            role: payload.role,
            hubId: payload.hubId,
            riderProfileId: payload.riderProfileId,
            email: payload.email,
            name: payload.name,
        };
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map