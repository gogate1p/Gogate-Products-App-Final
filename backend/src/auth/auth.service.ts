import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import { AuthenticatedUser } from './auth.types.js';

const jwtIssuer = process.env.JWT_ISSUER ?? 'gp-backend';
const jwtAudience = process.env.JWT_AUDIENCE ?? 'gp-app';
const jwtExpiresInRaw = process.env.JWT_EXPIRES_IN ?? '1h';
const jwtExpiresIn: number | `${number}${'ms' | 's' | 'm' | 'h' | 'd'}` = /^\d+$/.test(jwtExpiresInRaw)
  ? Number(jwtExpiresInRaw)
  : (jwtExpiresInRaw as `${number}${'ms' | 's' | 'm' | 'h' | 'd'}`);

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(user: AuthenticatedUser) {
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

    const options: JwtSignOptions = {
      issuer: jwtIssuer,
      audience: jwtAudience,
      expiresIn: jwtExpiresIn,
    };

    return this.jwtService.sign(payload, options);
  }

  verifyAccessToken(authorization: string): AuthenticatedUser {
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
}
