import {
  Module,
} from '@nestjs/common';

import {
  PassportModule,
} from '@nestjs/passport';

import {
  PrismaModule,
} from '../prisma/prisma.module.js';

import {
  PortalAuthModule,
} from '../portal-auth/portal-auth.module.js';

import {
  HubRoutingController,
} from './hub-routing.controller.js';

import {
  HubRoutingService,
} from './hub-routing.service.js';

@Module({
  imports: [
    PrismaModule,
    PortalAuthModule,
    PassportModule,
  ],

  controllers: [
    HubRoutingController,
  ],

  providers: [
    HubRoutingService,
  ],

  exports: [
    HubRoutingService,
  ],
})
export class HubRoutingModule {}