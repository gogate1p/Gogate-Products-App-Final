import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

@Injectable()
export class BranchJwtStrategy extends PassportStrategy(
  Strategy,
  'branch-jwt',
) {
  constructor() {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey:
        process.env.JWT_SECRET ||
        'super-secret-jwt-key',
    });
  }

  validate(payload: any) {
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
    };
  }
}