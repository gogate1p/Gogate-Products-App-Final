import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '../prisma/prisma.module.js';

import { BranchOpsController } from './branch-ops.controller.js';
import { BranchOpsService } from './branch-ops.service.js';
import { BranchJwtStrategy } from './branch-jwt.strategy.js';

@Module({
  imports: [
    PrismaModule,

    PassportModule.register({
      defaultStrategy: 'branch-jwt',
    }),

    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'super-secret-jwt-key',

      signOptions: {
        expiresIn: '12h',
      },
    }),
  ],

  controllers: [
    BranchOpsController,
  ],

  providers: [
    BranchOpsService,
    BranchJwtStrategy,
  ],
})
export class BranchOpsModule {}