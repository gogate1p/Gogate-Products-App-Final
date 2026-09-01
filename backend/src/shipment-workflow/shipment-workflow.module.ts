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
  ShipmentWorkflowController,
} from './shipment-workflow.controller.js';

import {
  ShipmentWorkflowService,
} from './shipment-workflow.service.js';

@Module({
  imports: [
    PrismaModule,
    PortalAuthModule,
    PassportModule,
  ],

  controllers: [
    ShipmentWorkflowController,
  ],

  providers: [
    ShipmentWorkflowService,
  ],

  exports: [
    ShipmentWorkflowService,
  ],
})
export class ShipmentWorkflowModule {}