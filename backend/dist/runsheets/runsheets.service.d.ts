import { PrismaService } from '../prisma/prisma.service.js';
import { EventsService } from '../events/events.service.js';
export declare class RunsheetsService {
    private readonly prisma;
    private readonly eventsService;
    constructor(prisma: PrismaService, eventsService: EventsService);
    createRunsheet(data: {
        tenantId: string;
        hubId: string;
        date: Date;
        slot?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        tenantId: string;
        riderId: string | null;
        date: Date;
        slot: string | null;
        hubId: string;
        vehicleId: string | null;
    }>;
    assignShipmentsToRunsheet(runsheetId: string, shipmentIds: string[]): Promise<{
        success: boolean;
        count: number;
    }>;
    assignRider(runsheetId: string, riderId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        tenantId: string;
        riderId: string | null;
        date: Date;
        slot: string | null;
        hubId: string;
        vehicleId: string | null;
    }>;
}
