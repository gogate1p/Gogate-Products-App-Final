import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import * as crypto from 'node:crypto';
import Razorpay from 'razorpay';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class RazorpayService {
  constructor(private readonly prisma: PrismaService) {}

  private client() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new ServiceUnavailableException('Razorpay is not configured.');
    }
    return { keyId, keySecret, client: new Razorpay({ key_id: keyId, key_secret: keySecret }) };
  }

  async createOrder(userId: string, tenantId: string, awb: string, amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('A positive payment amount is required.');
    }
    const shipment = await this.prisma.shipment.findFirst({
      where: { awb, tenantId },
      include: { order: true },
    });
    if (!shipment) throw new BadRequestException('Shipment not found.');

    const account = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, phone: true } });
    if (!account) throw new BadRequestException('Authenticated customer not found.');

    const { keyId, client } = this.client();
    const order = await client.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `shipment_${shipment.id}`.slice(0, 40),
      notes: { awb, tenantId, userId },
    });
    await this.prisma.payment.create({
      data: {
        shipmentId: shipment.id,
        amount,
        method: PaymentMethod.PREPAID,
        status: PaymentStatus.PENDING,
        gatewayReference: String(order.id),
      },
    });
    return { keyId, orderId: order.id, amount: order.amount, currency: order.currency, awb };
  }

  async verify(userId: string, tenantId: string, input: { awb: string; razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    const { keySecret } = this.client();
    const expected = crypto.createHmac('sha256', keySecret).update(`${input.razorpay_order_id}|${input.razorpay_payment_id}`).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(input.razorpay_signature))) {
      throw new BadRequestException('Payment signature verification failed.');
    }
    const shipment = await this.prisma.shipment.findFirst({ where: { awb: input.awb, tenantId } });
    if (!shipment) throw new BadRequestException('Shipment not found.');
    const payment = await this.prisma.payment.findFirst({ where: { shipmentId: shipment.id, gatewayReference: input.razorpay_order_id } });
    if (!payment) throw new BadRequestException('Payment order not found.');
    await this.prisma.payment.update({ where: { id: payment.id }, data: { status: PaymentStatus.SUCCESS, gatewayReference: input.razorpay_payment_id } });
    await this.prisma.order.update({ where: { id: shipment.orderId }, data: { paymentStatus: PaymentStatus.SUCCESS } });
    return { verified: true, paymentId: input.razorpay_payment_id, awb: input.awb };
  }
}
