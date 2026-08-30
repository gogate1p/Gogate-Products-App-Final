import { PrismaService } from '../prisma/prisma.service.js';
export declare enum ShipmentStatus {
    PENDING = "PENDING",
    BOOKED = "BOOKED",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    FAILED = "FAILED"
}
export declare class EventsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    emitShipmentEvent(data: {
        shipmentId: string;
        status: ShipmentStatus;
        userId?: string;
        locationLat?: number;
        locationLng?: number;
        deviceId?: string;
    }): Promise<{
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
