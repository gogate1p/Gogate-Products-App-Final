import {
  Module,
} from '@nestjs/common';

import {
  JwtModule,
} from '@nestjs/jwt';

import {
  PassportModule,
} from '@nestjs/passport';

import {
  PrismaModule,
} from '../prisma/prisma.module.js';

import {
  PortalAuthController,
} from './portal-auth.controller.js';

import {
  PortalAuthService,
} from './portal-auth.service.js';

import {
  PortalJwtStrategy,
} from './portal-jwt.strategy.js';

import {
  RolesGuard,
} from './roles.guard.js';

@Module({
  imports: [
    PrismaModule,

    PassportModule.register({
      defaultStrategy:
        'portal-jwt',

      session:
        false,
    }),

    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'development-jwt-secret-change-me',
    }),
  ],

  controllers: [
    PortalAuthController,
  ],

  providers: [
    PortalAuthService,
    PortalJwtStrategy,
    RolesGuard,
  ],

  exports: [
    PortalAuthService,
    RolesGuard,
  ],
})
export class PortalAuthModule {}