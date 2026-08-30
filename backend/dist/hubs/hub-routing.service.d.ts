import { PrismaService } from '../prisma/prisma.service.js';
export type HubRouteRequest = {
    tenantId: string;
    fromHubId: string;
    toHubId: string;
    serviceType?: string;
    priority?: number;
};
export type HubRouteResult = {
    valid: boolean;
    path: string[];
    lanes: Array<{
        fromHubId: string;
        toHubId: string;
        distanceKm?: number;
        expectedTransitMinutes?: number;
        priority?: number;
    }>;
    reason?: string;
};
export declare class HubRoutingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getRoute(request: HubRouteRequest): Promise<HubRouteResult>;
}
