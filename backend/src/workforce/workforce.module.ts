import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RiderEligibilityService } from './rider-eligibility.service.js';
import { RiderWorkforceService } from './rider-workforce.service.js';
import { WorkforceController } from './workforce.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [WorkforceController],
  providers: [RiderEligibilityService, RiderWorkforceService],
  exports: [RiderEligibilityService, RiderWorkforceService],
})
export class WorkforceModule {}
