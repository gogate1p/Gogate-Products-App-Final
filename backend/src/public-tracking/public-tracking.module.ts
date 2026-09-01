import {
  Module,
} from '@nestjs/common';

import {
  PrismaModule,
} from '../prisma/prisma.module.js';

import {
  PublicTrackingController,
} from './public-tracking.controller.js';

import {
  PublicTrackingService,
} from './public-tracking.service.js';

@Module({
  imports: [
    PrismaModule,
  ],

  controllers: [
    PublicTrackingController,
  ],

  providers: [
    PublicTrackingService,
  ],
})
export class PublicTrackingModule {}