var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EventsService } from '../events/events.service.js';
let RunsheetsService = class RunsheetsService {
    prisma;
    eventsService;
    constructor(prisma, eventsService) {
        this.prisma = prisma;
        this.eventsService = eventsService;
    }
    async createRunsheet(data) {
        return this.prisma.runsheet.create({
            data: {
                tenantId: data.tenantId,
                hubId: data.hubId,
                date: new Date(data.date),
                slot: data.slot,
            },
        });
    }
    async assignShipmentsToRunsheet(runsheetId, shipmentIds) {
        const runsheet = await this.prisma.runsheet.findUnique({ where: { id: runsheetId } });
        if (!runsheet)
            throw new BadRequestException('Runsheet not found');
        const data = shipmentIds.map((shipmentId, index) => ({
            runsheetId,
            shipmentId,
            sequenceOrder: index + 1,
        }));
        await this.prisma.runsheetShipment.createMany({
            data,
            skipDuplicates: true,
        });
        for (const id of shipmentIds) {
            await this.prisma.shipment.update({
                where: { id },
                data: { currentHubId: runsheet.hubId },
            });
        }
        return { success: true, count: shipmentIds.length };
    }
    async assignRider(runsheetId, riderId) {
        return this.prisma.runsheet.update({
            where: { id: runsheetId },
            data: { riderId, status: 'ASSIGNED' },
        });
    }
};
RunsheetsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        EventsService])
], RunsheetsService);
export { RunsheetsService };
//# sourceMappingURL=runsheets.service.js.map