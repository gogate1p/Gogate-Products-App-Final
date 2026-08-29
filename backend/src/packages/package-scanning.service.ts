import { Injectable, BadRequestException, ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EventsService, ShipmentStatus } from '../events/events.service.js';
import { ScanResolverService } from './scan-resolver.service.js';
import { PackageStatus } from '@prisma/client';

export type ScanType =
  | 'PACKAGE_SCAN'
  | 'AWB_SCAN'
  | 'QR_SCAN'
  | 'BAG_SCAN'
  | 'MANIFEST_SCAN'
  | 'HUB_CHECKIN_SCAN'
  | 'RIDER_ASSIGNMENT_SCAN'
  | 'PICKUP_SCAN'
  | 'DELIVERY_SCAN'
  | 'RETURN_SCAN'
  | 'REPLACEMENT_SCAN';

export type PackageScanRequest = {
  tenantId: string;
  actorUserId?: string;
  actorRole?: string;
  hubId?: string;
  shipmentId?: string;
  packageId?: string;
  bagId?: string;
  manifestId?: string;
  runsheetId?: string;
  riderId?: string;
  scanType: ScanType;
  scanValue: string;
  deviceId?: string;
  gpsLat?: number;
  gpsLng?: number;
  gpsAccuracy?: number;
  clientTimestamp?: Date;
  idempotencyKey?: string;
  metadata?: Record<string, any>;
};

export type PackageScanResult = {
  status: 'NEW' | 'ALREADY_PROCESSED';
  scan?: any;
  package?: any;
  shipment?: any;
  message?: string;
};

@Injectable()
export class PackageScanningService {
  private readonly logger = new Logger(PackageScanningService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService,
    private readonly scanResolver: ScanResolverService,
  ) {}

  async resolveScanValue(value: string) {
    const normalized = value?.trim();
    if (!normalized) {
      throw new BadRequestException('INVALID_BARCODE');
    }

    const shipment = await this.prisma.shipment.findFirst({
      where: { awb: normalized },
      include: { packages: true },
    });
    if (shipment) {
      return { kind: 'AWB', shipmentId: shipment.id };
    }

    const packageRecord = await this.prisma.package.findFirst({
      where: {
        OR: [{ barcode: normalized }, { qrCode: normalized }, { referenceCode: normalized }],
      },
      include: { shipment: true },
    });
    if (packageRecord) {
      return { kind: 'PACKAGE', packageId: packageRecord.id, shipmentId: packageRecord.shipmentId };
    }

    const bag = await this.prisma.bag.findFirst({
      where: { barcode: normalized },
    });
    if (bag) {
      return { kind: 'BAG', bagId: bag.id };
    }

    const manifest = await this.prisma.manifest.findFirst({
      where: { manifestNumber: normalized },
    });
    if (manifest) {
      return { kind: 'MANIFEST', manifestId: manifest.id };
    }

    throw new BadRequestException('INVALID_BARCODE');
  }

  async scanPackage(request: PackageScanRequest): Promise<PackageScanResult> {
    if (!request.actorUserId) {
      throw new ForbiddenException('TENANT_ACCESS_DENIED');
    }

    const actor = await this.prisma.user.findFirst({
      where: { id: request.actorUserId, tenantId: request.tenantId, status: 'ACTIVE' },
    });

    if (!actor) {
      throw new ForbiddenException('RIDER_NOT_ACTIVE');
    }

    if (request.riderId && request.riderId !== request.actorUserId) {
      throw new ForbiddenException('WRONG_RIDER');
    }

    if (request.idempotencyKey) {
      const existing = await this.prisma.packageScan.findFirst({
        where: {
          tenantId: request.tenantId,
          idempotencyKey: request.idempotencyKey,
          scanType: request.scanType,
        },
      });

      if (existing) {
        return { status: 'ALREADY_PROCESSED', scan: existing, message: 'ALREADY_PROCESSED' };
      }
    }

    const resolved = await this.scanResolver.resolve(request.scanValue);

    const packageRecord = await this.prisma.package.findFirst({
      where: {
        tenantId: request.tenantId,
        OR: [
          { id: request.packageId ?? '' },
          { barcode: request.scanValue },
          { qrCode: request.scanValue },
          { referenceCode: request.scanValue },
          { id: resolved.packageId ?? '' },
        ],
      },
      include: { shipment: true },
    });

    if (!packageRecord) {
      throw new NotFoundException('PACKAGE_NOT_FOUND');
    }

    if (request.shipmentId && packageRecord.shipmentId !== request.shipmentId) {
      throw new BadRequestException('SHIPMENT_STATE_INVALID');
    }

    if (request.runsheetId) {
      const runsheet = await this.prisma.runsheet.findFirst({
        where: {
          id: request.runsheetId,
          tenantId: request.tenantId,
          ...(request.riderId ? { riderId: request.riderId } : {}),
        },
      });

      if (!runsheet) {
        throw new BadRequestException('WRONG_RUNSHEET');
      }
    }

    const shipment = packageRecord.shipment ?? (await this.prisma.shipment.findUnique({ where: { id: packageRecord.shipmentId } }));
    const expectedHubIds = new Set(
      [shipment?.originHubId, shipment?.currentHubId, shipment?.destinationHubId].filter((hubId): hubId is string => !!hubId),
    );

    if (request.hubId && !expectedHubIds.has(request.hubId)) {
      throw new BadRequestException('PACKAGE_NOT_EXPECTED_AT_HUB');
    }

    if (request.hubId) {
      const hub = await this.prisma.hub.findFirst({
        where: { id: request.hubId, tenantId: request.tenantId },
      });

      if (!hub) {
        throw new ForbiddenException('WRONG_HUB');
      }
    }

    const scan = await this.prisma.$transaction(async (tx) => {
      const existing = request.idempotencyKey
        ? await tx.packageScan.findFirst({
            where: {
              tenantId: request.tenantId,
              idempotencyKey: request.idempotencyKey,
              scanType: request.scanType,
            },
          })
        : null;

      if (existing) {
        return existing;
      }

      const created = await tx.packageScan.create({
        data: {
          tenantId: request.tenantId,
          shipmentId: packageRecord.shipmentId,
          packageId: packageRecord.id,
          hubId: request.hubId,
          runsheetId: request.runsheetId,
          riderId: request.riderId,
          userId: request.actorUserId,
          scanType: request.scanType,
          scanValue: request.scanValue,
          idempotencyKey: request.idempotencyKey ?? `${request.scanType}:${packageRecord.id}:${Date.now()}`,
          deviceId: request.deviceId,
          actorRole: request.actorRole,
          gpsLat: request.gpsLat,
          gpsLng: request.gpsLng,
          gpsAccuracy: request.gpsAccuracy,
          clientTimestamp: request.clientTimestamp,
          metadata: request.metadata ?? {},
          status: 'VALID',
          createdByUserId: request.actorUserId,
        },
      });

      await tx.package.update({
        where: { id: packageRecord.id },
        data: {
          status: PackageStatus.AT_HUB,
          updatedAt: new Date(),
        },
      });

      await tx.shipmentEvent.create({
        data: {
          shipmentId: packageRecord.shipmentId,
          status: ShipmentStatus.IN_TRANSIT,
          userId: request.actorUserId,
          deviceId: request.deviceId,
          metadata: { scanType: request.scanType, packageId: packageRecord.id, idempotencyKey: created.idempotencyKey },
          timestamp: new Date(),
        },
      });

      return created;
    });

    await this.eventsService.emitShipmentEvent({
      shipmentId: packageRecord.shipmentId,
      status: ShipmentStatus.IN_TRANSIT,
      userId: request.actorUserId,
      deviceId: request.deviceId,
    });

    return {
      status: 'NEW',
      scan,
      package: packageRecord,
      shipment: packageRecord.shipment,
      message: 'NEW',
    };
  }

  async scanBatch(requests: PackageScanRequest[]) {
    const results = [] as Array<{ index: number; result: PackageScanResult; error?: string }>;

    for (let index = 0; index < requests.length; index += 1) {
      const request = requests[index];
      try {
        const result = await this.scanPackage(request);
        results.push({ index, result });
      } catch (error: any) {
        results.push({
          index,
          result: { status: 'ALREADY_PROCESSED', message: error?.response?.message ?? error.message },
          error: error?.response?.message ?? error.message,
        });
      }
    }

    return { results };
  }

  async getPackageById(id: string, tenantId: string) {
    const record = await this.prisma.package.findFirst({
      where: { id, tenantId },
      include: {
        shipment: true,
        scans: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!record) {
      throw new NotFoundException('PACKAGE_NOT_FOUND');
    }

    return record;
  }

  async getPackageHistory(id: string, tenantId: string) {
    return this.prisma.packageScan.findMany({
      where: { tenantId, packageId: id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getShipmentPackages(shipmentId: string, tenantId: string) {
    return this.prisma.package.findMany({
      where: { tenantId, shipmentId },
      orderBy: { packageNumber: 'asc' },
    });
  }
}
