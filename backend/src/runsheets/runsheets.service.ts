import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EventsService, ShipmentStatus } from '../events/events.service.js';

@Injectable()
export class RunsheetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService,
  ) {}

  async createRunsheet(data: {
    tenantId: string;
    hubId: string;
    date: Date;
    slot?: string;
  }) {
    return this.prisma.runsheet.create({
      data: {
        tenantId: data.tenantId,
        hubId: data.hubId,
        date: new Date(data.date),
        slot: data.slot,
      },
    });
  }

  async assignShipmentsToRunsheet(runsheetId: string, shipmentIds: string[]) {
    // 1. Verify runsheet exists
    const runsheet = await this.prisma.runsheet.findUnique({ where: { id: runsheetId } });
    if (!runsheet) throw new BadRequestException('Runsheet not found');

    // 2. Add shipments to runsheet
    const data = shipmentIds.map((shipmentId, index) => ({
      runsheetId,
      shipmentId,
      sequenceOrder: index + 1,
    }));

    await this.prisma.runsheetShipment.createMany({
      data,
      skipDuplicates: true,
    });

    // 3. Update shipment status and emit events
    for (const id of shipmentIds) {
      // In a real app, do this in a transaction or background job
      await this.prisma.shipment.update({
        where: { id },
        data: { currentHubId: runsheet.hubId },
      });
      // We don't mark OUT_FOR_DELIVERY until the rider actually starts the ride
    }

    return { success: true, count: shipmentIds.length };
  }

  async assignRider(runsheetId: string, riderId: string) {
    return this.prisma.runsheet.update({
      where: { id: runsheetId },
      data: { riderId, status: 'ASSIGNED' },
    });
  }
}
