import { Module } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
