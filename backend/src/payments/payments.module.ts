import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PaymentsController } from './payments.controller.js';
import { RazorpayService } from './razorpay.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController],
  providers: [RazorpayService],
})
export class PaymentsModule {}
