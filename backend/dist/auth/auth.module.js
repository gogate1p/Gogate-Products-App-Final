var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthContextService } from './auth-context.service.js';
import { AuthGuard } from './auth.guard.js';
import { AuthPolicyService } from './auth-policy.service.js';
import { AuthService } from './auth.service.js';
const jwtSecret = process.env.JWT_SECRET;
const jwtIssuer = process.env.JWT_ISSUER ?? 'gp-backend';
const jwtAudience = process.env.JWT_AUDIENCE ?? 'gp-app';
const jwtExpiresInRaw = process.env.JWT_EXPIRES_IN ?? '1h';
const jwtExpiresIn = /^\d+$/.test(jwtExpiresInRaw)
    ? Number(jwtExpiresInRaw)
    : jwtExpiresInRaw;
if (process.env.NODE_ENV === 'production' && !jwtSecret) {
    throw new Error('JWT_SECRET must be configured in production.');
}
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Global(),
    Module({
        imports: [
            JwtModule.register({
                secret: jwtSecret ?? 'development-secret',
                signOptions: {
                    issuer: jwtIssuer,
                    audience: jwtAudience,
                    expiresIn: jwtExpiresIn,
                },
                verifyOptions: {
                    issuer: jwtIssuer,
                    audience: jwtAudience,
                },
            }),
        ],
        providers: [AuthContextService, AuthPolicyService, AuthService, AuthGuard],
        exports: [AuthContextService, AuthPolicyService, AuthService, AuthGuard],
    })
], AuthModule);
export { AuthModule };
//# sourceMappingURL=auth.module.js.map