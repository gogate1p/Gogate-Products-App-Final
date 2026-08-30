var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ManifestStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
let ManifestService = class ManifestService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createManifest(input) {
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
    async addBagToManifest({ tenantId, manifestId, bagId }) {
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
    async sealManifest({ tenantId, manifestId }) {
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
    async dispatchManifest({ tenantId, manifestId, vehicleId, driverId }) {
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
    async receiveManifest({ tenantId, manifestId, receivedById }) {
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
};
ManifestService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ManifestService);
export { ManifestService };
//# sourceMappingURL=manifest.service.js.map