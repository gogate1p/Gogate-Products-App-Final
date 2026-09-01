import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from '../prisma/prisma.module.js';

import { HubOpsController } from './hub-ops.controller.js';
import { HubOpsService } from './hub-ops.service.js';
import { HubJwtStrategy } from './hub-jwt.strategy.js';

@Module({
  imports: [
    PrismaModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
  ],

  controllers: [
    HubOpsController,
  ],

  providers: [
    HubOpsService,
    HubJwtStrategy,
  ],

  exports: [
    PassportModule,
  ],
})
export class HubOpsModule {}