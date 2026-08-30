import { PrismaService } from '../prisma/prisma.service.js';
export type HubInboundRequest = {
    tenantId: string;
    actorUserId: string;
    hubId: string;
    packageId?: string;
    bagId?: string;
    manifestId?: string;
    scanValue?: string;
};
export declare class HubOperationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    receiveInbound(request: HubInboundRequest): Promise<{
        type: string;
        packageId: string;
        hubId: string;
        status: string;
        bagId?: undefined;
        manifestId?: undefined;
    } | {
        type: string;
        bagId: string;
        hubId: string;
        status: string;
        packageId?: undefined;
        manifestId?: undefined;
    } | {
        type: string;
        manifestId: string;
        hubId: string;
        status: string;
        packageId?: undefined;
        bagId?: undefined;
    }>;
}
