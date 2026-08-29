import { Module } from '@nestjs/common';
import { RunsheetsService } from './runsheets.service.js';
import { RunsheetsController } from './runsheets.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { EventsModule } from '../events/events.module.js';

@Module({
  imports: [PrismaModule, EventsModule],
  controllers: [RunsheetsController],
  providers: [RunsheetsService],
})
export class RunsheetsModule {}
