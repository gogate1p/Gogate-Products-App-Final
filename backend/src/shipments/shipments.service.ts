import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EventsService, ShipmentStatus } from '../events/events.service.js';
import { randomBytes } from 'crypto';

@Injectable()
export class ShipmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService,
  ) {}

  generateAwb(): string {
    // Generate a unique 12 character alphanumeric AWB
    return 'AWB' + randomBytes(4).toString('hex').toUpperCase();
  }

  async createShipment(data: {
    tenantId: string;
    orderId: string;
    serviceType: string;
    originHubId?: string;
    destinationHubId?: string;
  }) {
    const awb = this.generateAwb();
    const shipment = await this.prisma.shipment.create({
      data: {
        tenantId: data.tenantId,
        orderId: data.orderId,
        awb,
        status: ShipmentStatus.PENDING,
        serviceType: data.serviceType || 'NORMAL',
        originHubId: data.originHubId,
        destinationHubId: data.destinationHubId,
      },
    });

    await this.eventsService.emitShipmentEvent({
      shipmentId: shipment.id,
      status: ShipmentStatus.BOOKED,
    });

    return shipment;
  }

  async trackShipment(awb: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { awb },
      include: { events: { orderBy: { timestamp: 'desc' } } },
    });

    if (!shipment) throw new NotFoundException('Shipment not found');

    // Rule: Hide exact ETA for non-priority/hyperlocal
    let eta = null;
    if (shipment.serviceType === 'HYPERLOCAL' && shipment.status === ShipmentStatus.OUT_FOR_DELIVERY) {
       eta = '25-35 mins'; // Mock dynamic ETA
    }

    return {
      awb: shipment.awb,
      status: shipment.status,
      serviceType: shipment.serviceType,
      eta,
      timeline: shipment.events.map((e: any) => ({
        status: e.status,
        timestamp: e.timestamp,
      })),
    };
  }

  async markOutForDelivery(shipmentId: string, riderId: string) {
    return this.eventsService.emitShipmentEvent({
      shipmentId,
      status: ShipmentStatus.OUT_FOR_DELIVERY,
      userId: riderId,
    });
  }

  async markDelivered(shipmentId: string, riderId: string, locationLat?: number, locationLng?: number) {
    // OTP verification would go here before emitting DELIVERED
    return this.eventsService.emitShipmentEvent({
      shipmentId,
      status: ShipmentStatus.DELIVERED,
      userId: riderId,
      locationLat,
      locationLng,
    });
  }
}
