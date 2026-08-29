import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { EventsModule } from '../events/events.module.js';
import { PackageScanningService } from './package-scanning.service.js';
import { ScanResolverService } from './scan-resolver.service.js';
import { PackagesController } from './packages.controller.js';

@Module({
  imports: [PrismaModule, EventsModule],
  controllers: [PackagesController],
  providers: [PackageScanningService, ScanResolverService],
  exports: [PackageScanningService, ScanResolverService],
})
export class PackagesModule {}
