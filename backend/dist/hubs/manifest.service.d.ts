import { PrismaService } from '../prisma/prisma.service.js';
export type CreateManifestInput = {
    tenantId: string;
    originHubId: string;
    destinationHubId: string;
    createdByUserId?: string;
    vehicleId?: string;
    driverId?: string;
    manifestNumber?: string;
};
export declare class ManifestService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createManifest(input: CreateManifestInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ManifestStatus;
        tenantId: string;
        originHubId: string | null;
        destinationHubId: string | null;
        vehicleId: string | null;
        createdById: string | null;
        manifestNumber: string;
        type: import("@prisma/client").$Enums.ManifestType;
        driverId: string | null;
        receivedById: string | null;
    }>;
    addBagToManifest({ tenantId, manifestId, bagId }: {
        tenantId: string;
        manifestId: string;
        bagId: string;
    }): Promise<{
        id: string;
        status: string;
        packageId: string | null;
        bagId: string | null;
        manifestId: string;
    }>;
    sealManifest({ tenantId, manifestId }: {
        tenantId: string;
        manifestId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ManifestStatus;
        tenantId: string;
        originHubId: string | null;
        destinationHubId: string | null;
        vehicleId: string | null;
        createdById: string | null;
        manifestNumber: string;
        type: import("@prisma/client").$Enums.ManifestType;
        driverId: string | null;
        receivedById: string | null;
    }>;
    dispatchManifest({ tenantId, manifestId, vehicleId, driverId }: {
        tenantId: string;
        manifestId: string;
        vehicleId?: string;
        driverId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ManifestStatus;
        tenantId: string;
        originHubId: string | null;
        destinationHubId: string | null;
        vehicleId: string | null;
        createdById: string | null;
        manifestNumber: string;
        type: import("@prisma/client").$Enums.ManifestType;
        driverId: string | null;
        receivedById: string | null;
    }>;
    receiveManifest({ tenantId, manifestId, receivedById }: {
        tenantId: string;
        manifestId: string;
        receivedById?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ManifestStatus;
        tenantId: string;
        originHubId: string | null;
        destinationHubId: string | null;
        vehicleId: string | null;
        createdById: string | null;
        manifestNumber: string;
        type: import("@prisma/client").$Enums.ManifestType;
        driverId: string | null;
        receivedById: string | null;
    }>;
}
