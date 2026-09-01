import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class HubJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor() {
    const secret =
      process.env.JWT_SECRET ||
      'super-secret-jwt-key';

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration:
        false,

      secretOrKey:
        secret,
    });
  }

  async validate(payload: any) {
    /*
     * Supports common JWT shapes:
     *
     * {
     *   sub: "...",
     *   role: "...",
     *   tenantId: "..."
     * }
     *
     * or:
     *
     * {
     *   userId: "...",
     *   role: "..."
     * }
     */

    return {
      ...payload,

      id:
        payload.id ??
        payload.userId ??
        payload.sub,

      userId:
        payload.userId ??
        payload.id ??
        payload.sub,

      sub:
        payload.sub ??
        payload.userId ??
        payload.id,
    };
  }
}