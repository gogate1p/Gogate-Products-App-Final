import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export type HubInboundRequest = {
  tenantId: string;
  actorUserId: string;
  hubId: string;
  packageId?: string;
  bagId?: string;
  manifestId?: string;
  scanValue?: string;
};

@Injectable()
export class HubOperationsService {
  constructor(private readonly prisma: PrismaService) {}

  async receiveInbound(request: HubInboundRequest) {
    const hub = await this.prisma.hub.findFirst({
      where: { id: request.hubId, tenantId: request.tenantId },
    });

    if (!hub) {
      throw new NotFoundException('HUB_NOT_FOUND');
    }

    if (request.packageId) {
      const pkg = await this.prisma.package.findFirst({
        where: { id: request.packageId, tenantId: request.tenantId },
      });

      if (!pkg) {
        throw new NotFoundException('PACKAGE_NOT_FOUND');
      }

      return {
        type: 'PACKAGE',
        packageId: pkg.id,
        hubId: hub.id,
        status: 'RECEIVED',
      };
    }

    if (request.bagId) {
      const bag = await this.prisma.bag.findFirst({
        where: { id: request.bagId, originHubId: request.hubId },
      });

      if (!bag) {
        throw new BadRequestException('BAG_NOT_FOUND');
      }

      return {
        type: 'BAG',
        bagId: bag.id,
        hubId: hub.id,
        status: 'RECEIVED',
      };
    }

    if (request.manifestId) {
      const manifest = await this.prisma.manifest.findFirst({
        where: { id: request.manifestId, tenantId: request.tenantId },
      });

      if (!manifest) {
        throw new NotFoundException('MANIFEST_NOT_FOUND');
      }

      return {
        type: 'MANIFEST',
        manifestId: manifest.id,
        hubId: hub.id,
        status: 'RECEIVED',
      };
    }

    throw new BadRequestException('INVALID_INBOUND_TARGET');
  }
}
