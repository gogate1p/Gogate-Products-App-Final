var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EventsService, ShipmentStatus } from '../events/events.service.js';
import { randomBytes } from 'crypto';
let ShipmentsService = class ShipmentsService {
    prisma;
    eventsService;
    constructor(prisma, eventsService) {
        this.prisma = prisma;
        this.eventsService = eventsService;
    }
    generateAwb() {
        return 'AWB' + randomBytes(4).toString('hex').toUpperCase();
    }
    async createShipment(data) {
        const awb = this.generateAwb();
        const shipment = await this.prisma.shipment.create({
            data: {
                tenantId: data.tenantId,
                orderId: data.orderId,
                awb,
                status: ShipmentStatus.PENDING,
                serviceType: data.serviceType || 'NORMAL',
                originHubId: data.originHubId,
                destinationHubId: data.destinationHubId,
            },
        });
        await this.eventsService.emitShipmentEvent({
            shipmentId: shipment.id,
            status: ShipmentStatus.BOOKED,
        });
        return shipment;
    }
    async trackShipment(awb) {
        const shipment = await this.prisma.shipment.findUnique({
            where: { awb },
            include: { events: { orderBy: { timestamp: 'desc' } } },
        });
        if (!shipment)
            throw new NotFoundException('Shipment not found');
        let eta = null;
        if (shipment.serviceType === 'HYPERLOCAL' && shipment.status === ShipmentStatus.OUT_FOR_DELIVERY) {
            eta = '25-35 mins';
        }
        return {
            awb: shipment.awb,
            status: shipment.status,
            serviceType: shipment.serviceType,
            eta,
            timeline: shipment.events.map((e) => ({
                status: e.status,
                timestamp: e.timestamp,
            })),
        };
    }
    async markOutForDelivery(shipmentId, riderId) {
        return this.eventsService.emitShipmentEvent({
            shipmentId,
            status: ShipmentStatus.OUT_FOR_DELIVERY,
            userId: riderId,
        });
    }
    async markDelivered(shipmentId, riderId, locationLat, locationLng) {
        return this.eventsService.emitShipmentEvent({
            shipmentId,
            status: ShipmentStatus.DELIVERED,
            userId: riderId,
            locationLat,
            locationLng,
        });
    }
};
ShipmentsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        EventsService])
], ShipmentsService);
export { ShipmentsService };
//# sourceMappingURL=shipments.service.js.map