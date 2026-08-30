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
import { PrismaService } from '../prisma/prisma.service.js';
let HubOperationsService = class HubOperationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async receiveInbound(request) {
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
};
HubOperationsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], HubOperationsService);
export { HubOperationsService };
//# sourceMappingURL=hub-operations.service.js.map