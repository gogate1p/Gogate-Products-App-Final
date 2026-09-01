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
  CustomerPortalController,
} from './customer-portal.controller.js';

import {
  CustomerPortalService,
} from './customer-portal.service.js';

@Module({
  imports: [
    PrismaModule,
    PortalAuthModule,
    PassportModule,
  ],

  controllers: [
    CustomerPortalController,
  ],

  providers: [
    CustomerPortalService,
  ],
})
export class CustomerPortalModule {}