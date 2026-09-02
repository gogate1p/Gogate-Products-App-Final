import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RazorpayService } from './razorpay.service.js';

@Controller('payments')
@UseGuards(AuthGuard('portal-jwt'))
export class PaymentsController {
  constructor(private readonly service: RazorpayService) {}

  @Post('razorpay/order')
  createOrder(@Req() req: any, @Body() body: { awb: string; amount: number }) {
    return this.service.createOrder(req.user?.id ?? req.user?.userId ?? req.user?.sub, req.user?.tenantId, body.awb, Number(body.amount));
  }

  @Post('razorpay/verify')
  verify(@Req() req: any, @Body() body: { awb: string; razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    return this.service.verify(req.user?.id ?? req.user?.userId ?? req.user?.sub, req.user?.tenantId, body);
  }
}
