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
  CustomerShipmentDetailController,
} from './customer-shipment-detail.controller.js';

import {
  CustomerShipmentDetailService,
} from './customer-shipment-detail.service.js';

@Module({
  imports: [
    PrismaModule,
    PortalAuthModule,
    PassportModule,
  ],

  controllers: [
    CustomerShipmentDetailController,
  ],

  providers: [
    CustomerShipmentDetailService,
  ],
})
export class CustomerShipmentDetailModule {}