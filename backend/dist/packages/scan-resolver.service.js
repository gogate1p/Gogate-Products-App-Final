var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let ScanResolverService = class ScanResolverService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resolve(value) {
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
};
ScanResolverService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ScanResolverService);
export { ScanResolverService };
//# sourceMappingURL=scan-resolver.service.js.map