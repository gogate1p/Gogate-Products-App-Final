import { BadRequestException, Injectable, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PrismaService } from '../prisma/prisma.service.js';

export type LocationPing = {
  awb: string;
  latitude: number;
  longitude: number;
  speed?: number;
  timestamp?: string;
  deviceId?: string;
};

@Injectable()
export class RealtimeService implements OnModuleDestroy {
  private readonly redis?: Redis;

  constructor(private readonly prisma: PrismaService) {
    const url = process.env.REDIS_URL;
    if (url) this.redis = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 1 });
  }

  private key(awb: string) { return `gogate:hyperlocal:location:${awb}`; }

  async ingest(userId: string, tenantId: string, input: LocationPing) {
    const latitude = Number(input.latitude);
    const longitude = Number(input.longitude);
    const speed = input.speed == null ? undefined : Number(input.speed);
    if (!input.awb || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      throw new BadRequestException('Valid shipment and GPS coordinates are required.');
    }
    if (speed != null && (!Number.isFinite(speed) || speed < 0 || speed > 250)) throw new BadRequestException('Invalid speed.');

    const shipment = await this.prisma.shipment.findFirst({ where: { awb: input.awb, tenantId }, select: { id: true, awb: true, serviceType: true, status: true } });
    if (!shipment) throw new NotFoundException('Shipment not found.');
    if (shipment.serviceType.toUpperCase() !== 'HYPERLOCAL') throw new BadRequestException('Live rider tracking is available only for hyperlocal shipments.');

    const timestamp = input.timestamp && !Number.isNaN(Date.parse(input.timestamp)) ? new Date(input.timestamp) : new Date();
    const state = { awb: shipment.awb, latitude, longitude, speed: speed ?? 0, timestamp: timestamp.toISOString(), deviceId: input.deviceId ?? null, riderId: userId };
    if (this.redis) {
      await this.redis.connect().catch(() => undefined);
      await this.redis.set(this.key(shipment.awb), JSON.stringify(state), 'EX', 120).catch(() => undefined);
      await this.redis.xadd('gogate:hyperlocal:locations', 'MAXLEN', '~', 100000, '*', 'awb', shipment.awb, 'payload', JSON.stringify(state)).catch(() => undefined);
      await this.redis.publish(`gogate:hyperlocal:${shipment.awb}`, JSON.stringify(state)).catch(() => undefined);
    }
    await this.prisma.shipmentEvent.create({ data: { shipmentId: shipment.id, status: 'RIDER_LOCATION', locationLat: latitude, locationLng: longitude, userId, deviceId: input.deviceId, metadata: { speed, source: 'edge-gps', expiresInSeconds: 120 }, timestamp } });
    return { accepted: true, ...state, expiresAt: new Date(timestamp.getTime() + 120000).toISOString() };
  }

  async latest(userId: string, tenantId: string, awb: string) {
    const shipment = await this.prisma.shipment.findFirst({ where: { awb, tenantId }, select: { id: true, awb: true, serviceType: true } });
    if (!shipment) throw new NotFoundException('Shipment not found.');
    if (shipment.serviceType.toUpperCase() !== 'HYPERLOCAL') throw new BadRequestException('Live rider tracking is available only for hyperlocal shipments.');
    if (this.redis) {
      await this.redis.connect().catch(() => undefined);
      const value = await this.redis.get(this.key(awb)).catch(() => null);
      if (value) return JSON.parse(value);
    }
    return null;
  }

  async onModuleDestroy() { if (this.redis) await this.redis.quit().catch(() => undefined); }
}
