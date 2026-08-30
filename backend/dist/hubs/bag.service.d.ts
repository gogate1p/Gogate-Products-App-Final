import { PrismaService } from '../prisma/prisma.service.js';
export type CreateBagInput = {
    tenantId: string;
    originHubId: string;
    destinationHubId: string;
    createdByUserId?: string;
    barcode?: string;
};
export declare class BagService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createBag(input: CreateBagInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BagStatus;
        tenantId: string;
        originHubId: string;
        destinationHubId: string;
        barcode: string;
        weight: number | null;
        sealNumber: string | null;
        createdById: string | null;
        closedById: string | null;
    }>;
    addPackageToBag({ tenantId, bagId, packageId, hubId, }: {
        tenantId: string;
        bagId: string;
        packageId: string;
        hubId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        packageId: string;
        bagId: string;
    }>;
    sealBag({ tenantId, bagId, sealedByUserId }: {
        tenantId: string;
        bagId: string;
        sealedByUserId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BagStatus;
        tenantId: string;
        originHubId: string;
        destinationHubId: string;
        barcode: string;
        weight: number | null;
        sealNumber: string | null;
        createdById: string | null;
        closedById: string | null;
    }>;
    openBag({ tenantId, bagId, openedByUserId }: {
        tenantId: string;
        bagId: string;
        openedByUserId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BagStatus;
        tenantId: string;
        originHubId: string;
        destinationHubId: string;
        barcode: string;
        weight: number | null;
        sealNumber: string | null;
        createdById: string | null;
        closedById: string | null;
    }>;
}
