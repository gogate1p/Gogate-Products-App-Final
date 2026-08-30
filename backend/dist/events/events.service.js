var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EventsService_1;
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
export var ShipmentStatus;
(function (ShipmentStatus) {
    ShipmentStatus["PENDING"] = "PENDING";
    ShipmentStatus["BOOKED"] = "BOOKED";
    ShipmentStatus["PICKED_UP"] = "PICKED_UP";
    ShipmentStatus["IN_TRANSIT"] = "IN_TRANSIT";
    ShipmentStatus["OUT_FOR_DELIVERY"] = "OUT_FOR_DELIVERY";
    ShipmentStatus["DELIVERED"] = "DELIVERED";
    ShipmentStatus["FAILED"] = "FAILED";
})(ShipmentStatus || (ShipmentStatus = {}));
let EventsService = EventsService_1 = class EventsService {
    prisma;
    logger = new Logger(EventsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async emitShipmentEvent(data) {
        const event = await this.prisma.shipmentEvent.create({
            data: {
                shipmentId: data.shipmentId,
                status: data.status,
                userId: data.userId,
                locationLat: data.locationLat,
                locationLng: data.locationLng,
                deviceId: data.deviceId,
            },
        });
        await this.prisma.shipment.update({
            where: { id: data.shipmentId },
            data: { status: data.status },
        });
        this.logger.log(`Shipment ${data.shipmentId} transitioned to ${data.status}`);
        return event;
    }
};
EventsService = EventsService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], EventsService);
export { EventsService };
//# sourceMappingURL=events.service.js.map