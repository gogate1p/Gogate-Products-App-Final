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
  : (jwtExpiresInRaw as `${number}${'ms' | 's' | 'm' | 'h' | 'd'}`);

if (process.env.NODE_ENV === 'production' && !jwtSecret) {
  throw new Error('JWT_SECRET must be configured in production.');
}

@Global()
@Module({
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
export class AuthModule {}
