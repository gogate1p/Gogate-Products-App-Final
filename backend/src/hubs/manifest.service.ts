import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ManifestStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

export type CreateManifestInput = {
  tenantId: string;
  originHubId: string;
  destinationHubId: string;
  createdByUserId?: string;
  vehicleId?: string;
  driverId?: string;
  manifestNumber?: string;
};

@Injectable()
export class ManifestService {
  constructor(private readonly prisma: PrismaService) {}

  async createManifest(input: CreateManifestInput) {
    const manifestNumber = input.manifestNumber ?? `MF-${Date.now()}`;

    return this.prisma.manifest.create({
      data: {
        tenantId: input.tenantId,
        manifestNumber,
        type: 'HUB_OUTBOUND',
        status: ManifestStatus.OPEN,
        originHubId: input.originHubId,
        destinationHubId: input.destinationHubId,
        vehicleId: input.vehicleId,
        driverId: input.driverId,
        createdById: input.createdByUserId,
      },
    });
  }

  async addBagToManifest({ tenantId, manifestId, bagId }: { tenantId: string; manifestId: string; bagId: string }) {
    const manifest = await this.prisma.manifest.findFirst({
      where: { id: manifestId, tenantId },
    });

    if (!manifest) {
      throw new NotFoundException('MANIFEST_NOT_FOUND');
    }

    const bag = await this.prisma.bag.findFirst({
      where: { id: bagId },
    });

    if (!bag) {
      throw new NotFoundException('BAG_NOT_FOUND');
    }

    const existing = await this.prisma.manifestItem.findFirst({
      where: { manifestId, bagId },
    });

    if (existing) {
      throw new BadRequestException('DUPLICATE_MANIFEST_ITEM');
    }

    return this.prisma.manifestItem.create({
      data: {
        manifestId,
        bagId,
        status: 'PENDING',
      },
    });
  }

  async sealManifest({ tenantId, manifestId }: { tenantId: string; manifestId: string }) {
    const manifest = await this.prisma.manifest.findFirst({
      where: { id: manifestId, tenantId },
      include: { items: true },
    });

    if (!manifest) {
      throw new NotFoundException('MANIFEST_NOT_FOUND');
    }

    if (!manifest.items.length) {
      throw new BadRequestException('MANIFEST_EMPTY');
    }

    return this.prisma.manifest.update({
      where: { id: manifestId },
      data: {
        status: ManifestStatus.SEALED,
        updatedAt: new Date(),
      },
    });
  }

  async dispatchManifest({ tenantId, manifestId, vehicleId, driverId }: { tenantId: string; manifestId: string; vehicleId?: string; driverId?: string }) {
    const manifest = await this.prisma.manifest.findFirst({
      where: { id: manifestId, tenantId },
    });

    if (!manifest) {
      throw new NotFoundException('MANIFEST_NOT_FOUND');
    }

    if (manifest.status !== ManifestStatus.SEALED) {
      throw new BadRequestException('MANIFEST_NOT_SEALED');
    }

    return this.prisma.manifest.update({
      where: { id: manifestId },
      data: {
        status: ManifestStatus.DISPATCHED,
        vehicleId,
        driverId,
        updatedAt: new Date(),
      },
    });
  }

  async receiveManifest({ tenantId, manifestId, receivedById }: { tenantId: string; manifestId: string; receivedById?: string }) {
    const manifest = await this.prisma.manifest.findFirst({
      where: { id: manifestId, tenantId },
    });

    if (!manifest) {
      throw new NotFoundException('MANIFEST_NOT_FOUND');
    }

    return this.prisma.manifest.update({
      where: { id: manifestId },
      data: {
        status: ManifestStatus.RECEIVED,
        receivedById,
        updatedAt: new Date(),
      },
    });
  }
}
