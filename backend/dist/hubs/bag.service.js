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
import { BagStatus, PackageStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
let BagService = class BagService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBag(input) {
        const barcode = input.barcode ?? `BAG-${Date.now()}`;
        return this.prisma.bag.create({
            data: {
                tenantId: input.tenantId,
                barcode,
                originHubId: input.originHubId,
                destinationHubId: input.destinationHubId,
                status: BagStatus.OPEN,
                createdById: input.createdByUserId,
            },
        });
    }
    async addPackageToBag({ tenantId, bagId, packageId, hubId, }) {
        const bag = await this.prisma.bag.findFirst({
            where: { id: bagId, originHubId: hubId },
        });
        if (!bag) {
            throw new NotFoundException('BAG_NOT_FOUND');
        }
        const pkg = await this.prisma.package.findFirst({
            where: { id: packageId, tenantId },
        });
        if (!pkg) {
            throw new NotFoundException('PACKAGE_NOT_FOUND');
        }
        if (bag.status === BagStatus.SEALED || bag.status === BagStatus.IN_TRANSIT || bag.status === BagStatus.RECEIVED) {
            throw new BadRequestException('BAG_NOT_ACCEPTING_ITEMS');
        }
        const existing = await this.prisma.bagItem.findFirst({
            where: { bagId, packageId },
        });
        if (existing) {
            throw new BadRequestException('PACKAGE_ALREADY_IN_BAG');
        }
        const activeBag = await this.prisma.bagItem.findFirst({
            where: {
                packageId,
                bag: { status: { in: [BagStatus.OPEN, BagStatus.SEALED, BagStatus.IN_TRANSIT] } },
            },
            include: { bag: true },
        });
        if (activeBag && activeBag.bagId !== bagId) {
            throw new BadRequestException('PACKAGE_ALREADY_IN_ACTIVE_BAG');
        }
        const item = await this.prisma.bagItem.create({
            data: {
                bagId,
                packageId,
            },
        });
        await this.prisma.package.update({
            where: { id: packageId },
            data: {
                status: PackageStatus.BAGGED,
                updatedAt: new Date(),
            },
        });
        return item;
    }
    async sealBag({ tenantId, bagId, sealedByUserId }) {
        const bag = await this.prisma.bag.findFirst({
            where: { id: bagId },
            include: { items: true },
        });
        if (!bag) {
            throw new NotFoundException('BAG_NOT_FOUND');
        }
        if (bag.status === BagStatus.SEALED) {
            return bag;
        }
        if (bag.status === BagStatus.RECEIVED || bag.status === BagStatus.OPENED) {
            throw new BadRequestException('BAG_SEAL_STATE_INVALID');
        }
        return this.prisma.bag.update({
            where: { id: bagId },
            data: {
                status: BagStatus.SEALED,
                updatedAt: new Date(),
            },
        });
    }
    async openBag({ tenantId, bagId, openedByUserId }) {
        const bag = await this.prisma.bag.findFirst({
            where: { id: bagId },
        });
        if (!bag) {
            throw new NotFoundException('BAG_NOT_FOUND');
        }
        if (bag.status !== BagStatus.SEALED) {
            throw new BadRequestException('BAG_OPEN_REQUIRES_SEAL');
        }
        return this.prisma.bag.update({
            where: { id: bagId },
            data: {
                status: BagStatus.OPENED,
                updatedAt: new Date(),
            },
        });
    }
};
BagService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], BagService);
export { BagService };
//# sourceMappingURL=bag.service.js.map