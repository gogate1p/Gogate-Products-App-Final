import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

@Injectable()
export class PortalJwtStrategy extends PassportStrategy(
  Strategy,
  'portal-jwt',
) {
  constructor() {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration:
        false,

      secretOrKey:
        process.env.JWT_SECRET ||
        'development-jwt-secret-change-me',
    });
  }

  validate(payload: any) {
    return {
      id:
        payload.sub,

      userId:
        payload.sub,

      tenantId:
        payload.tenantId,

      role:
        payload.role,

      userCode:
        payload.userCode,
    };
  }
}