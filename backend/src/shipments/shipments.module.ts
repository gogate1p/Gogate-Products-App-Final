import { Module } from '@nestjs/common';
import { ShipmentsService } from './shipments.service.js';
import { ShipmentsController } from './shipments.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { EventsModule } from '../events/events.module.js';

@Module({
  imports: [PrismaModule, EventsModule],
  controllers: [ShipmentsController],
  providers: [ShipmentsService],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}
