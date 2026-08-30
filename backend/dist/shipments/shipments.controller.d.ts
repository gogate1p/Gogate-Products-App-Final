import { ShipmentsService } from './shipments.service.js';
export declare class ShipmentsController {
    private readonly shipmentsService;
    constructor(shipmentsService: ShipmentsService);
    createShipment(body: any): Promise<{
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
    markOutForDelivery(id: string, riderId: string): Promise<{
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
    markDelivered(id: string, riderId: string, lat?: number, lng?: number): Promise<{
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
