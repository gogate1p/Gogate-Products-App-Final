import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export enum ShipmentStatus {
  PENDING = 'PENDING',
  BOOKED = 'BOOKED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async emitShipmentEvent(data: {
    shipmentId: string;
    status: ShipmentStatus;
    userId?: string;
    locationLat?: number;
    locationLng?: number;
    deviceId?: string;
  }) {
    // 1. Log the immutable event
    const event = await this.prisma.shipmentEvent.create({
      data: {
        shipmentId: data.shipmentId,
        status: data.status,
        userId: data.userId,
        locationLat: data.locationLat,
        locationLng: data.locationLng,
        deviceId: data.deviceId,
      },
    });

    // 2. Update the actual shipment status
    await this.prisma.shipment.update({
      where: { id: data.shipmentId },
      data: { status: data.status },
    });

    // 3. (Phase 2/3) Publish to Redis/Kafka for notifications/webhooks
    this.logger.log(`Shipment ${data.shipmentId} transitioned to ${data.status}`);

    return event;
  }
}
