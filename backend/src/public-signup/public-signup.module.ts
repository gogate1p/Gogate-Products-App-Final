import {
  Module,
} from '@nestjs/common';

import {
  JwtModule,
} from '@nestjs/jwt';

import {
  PrismaModule,
} from '../prisma/prisma.module.js';

import {
  PublicSignupController,
} from './public-signup.controller.js';

import {
  PublicSignupService,
} from './public-signup.service.js';

@Module({
  imports: [
    PrismaModule,

    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'development-jwt-secret-change-me',
    }),
  ],

  controllers: [
    PublicSignupController,
  ],

  providers: [
    PublicSignupService,
  ],
})
export class PublicSignupModule {}