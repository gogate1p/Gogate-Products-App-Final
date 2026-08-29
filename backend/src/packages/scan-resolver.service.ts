import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export type ResolvedScanTarget = {
  kind: 'AWB' | 'PACKAGE' | 'BAG' | 'MANIFEST' | 'HUB' | 'UNKNOWN';
  shipmentId?: string;
  packageId?: string;
  bagId?: string;
  manifestId?: string;
  hubId?: string;
};

@Injectable()
export class ScanResolverService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(value: string): Promise<ResolvedScanTarget> {
    const normalized = value?.trim();
    if (!normalized) {
      throw new BadRequestException('INVALID_BARCODE');
    }

    const shipment = await this.prisma.shipment.findFirst({ where: { awb: normalized } });
    if (shipment) {
      return { kind: 'AWB', shipmentId: shipment.id };
    }

    const packageRecord = await this.prisma.package.findFirst({
      where: {
        OR: [{ barcode: normalized }, { qrCode: normalized }, { referenceCode: normalized }],
      },
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

    const hub = await this.prisma.hub.findFirst({
      where: { name: normalized },
    });
    if (hub) {
      return { kind: 'HUB', hubId: hub.id };
    }

    return { kind: 'UNKNOWN' };
  }
}
