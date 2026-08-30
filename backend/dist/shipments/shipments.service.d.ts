import { PrismaService } from '../prisma/prisma.service.js';
import { EventsService } from '../events/events.service.js';
export declare class ShipmentsService {
    private readonly prisma;
    private readonly eventsService;
    constructor(prisma: PrismaService, eventsService: EventsService);
    generateAwb(): string;
    createShipment(data: {
        tenantId: string;
        orderId: string;
        serviceType: string;
        originHubId?: string;
        destinationHubId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        awb: string;
        tenantId: string;
        orderId: string;
        serviceType: string;
        obdRequired: boolean;
        originHubId: string | null;
        destinationHubId: string | null;
        currentHubId: string | null;
        originalShipmentId: string | null;
    }>;
    trackShipment(awb: string): Promise<{
        awb: string;
        status: string;
        serviceType: string;
        eta: string | null;
        timeline: {
            status: any;
            timestamp: any;
        }[];
    }>;
    markOutForDelivery(shipmentId: string, riderId: string): Promise<{
        id: string;
        status: string;
        locationLat: number | null;
        locationLng: number | null;
        deviceId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        timestamp: Date;
        shipmentId: string;
        userId: string | null;
    }>;
    markDelivered(shipmentId: string, riderId: string, locationLat?: number, locationLng?: number): Promise<{
        id: string;
        status: string;
        locationLat: number | null;
        locationLng: number | null;
        deviceId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        timestamp: Date;
        shipmentId: string;
        userId: string | null;
    }>;
}
