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
  ShipmentWorkflowModule,
} from '../shipment-workflow/shipment-workflow.module.js';

import {
  CustomerTrackingController,
} from './customer-tracking.controller.js';

import {
  CustomerTrackingService,
} from './customer-tracking.service.js';

@Module({
  imports: [
    PrismaModule,
    PortalAuthModule,
    PassportModule,
    ShipmentWorkflowModule,
  ],

  controllers: [
    CustomerTrackingController,
  ],

  providers: [
    CustomerTrackingService,
  ],
})
export class CustomerTrackingModule {}