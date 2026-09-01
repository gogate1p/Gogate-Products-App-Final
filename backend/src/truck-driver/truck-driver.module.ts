import {
  Module
} from '@nestjs/common';

import {
  TruckDriverController
} from './truck-driver.controller.js';

import {
  TruckDriverService
} from './truck-driver.service.js';

import {
  PrismaModule
} from '../prisma/prisma.module.js';

@Module({
  imports: [
    PrismaModule
  ],

  controllers: [
    TruckDriverController
  ],

  providers: [
    TruckDriverService
  ]
})
export class TruckDriverModule {}