var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let HubRoutingService = class HubRoutingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRoute(request) {
        const lanes = await this.prisma.hubNetworkLane.findMany({
            where: {
                tenantId: request.tenantId,
                active: true,
            },
        });
        const matchesService = (lane) => !request.serviceType || lane.serviceTypes.length === 0 || lane.serviceTypes.includes(request.serviceType);
        const adjacency = new Map();
        for (const lane of lanes) {
            if (!matchesService(lane))
                continue;
            if (!adjacency.has(lane.fromHubId))
                adjacency.set(lane.fromHubId, []);
            adjacency.get(lane.fromHubId).push(lane);
        }
        for (const outgoing of adjacency.values()) {
            outgoing.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
        }
        const queue = [{ hubId: request.fromHubId, path: [request.fromHubId], lanes: [] }];
        const visited = new Set();
        while (queue.length) {
            const current = queue.shift();
            if (visited.has(current.hubId))
                continue;
            visited.add(current.hubId);
            if (current.hubId === request.toHubId) {
                return {
                    valid: true,
                    path: current.path,
                    lanes: current.lanes.map((lane) => ({
                        fromHubId: lane.fromHubId,
                        toHubId: lane.toHubId,
                        distanceKm: lane.distanceKm ?? undefined,
                        expectedTransitMinutes: lane.expectedTransitMinutes ?? undefined,
                        priority: lane.priority ?? undefined,
                    })),
                };
            }
            const nextLanes = adjacency.get(current.hubId) ?? [];
            for (const lane of nextLanes) {
                if (visited.has(lane.toHubId))
                    continue;
                queue.push({
                    hubId: lane.toHubId,
                    path: [...current.path, lane.toHubId],
                    lanes: [...current.lanes, lane],
                });
            }
        }
        return {
            valid: false,
            path: [],
            lanes: [],
            reason: 'NO_VALID_LANE',
        };
    }
};
HubRoutingService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], HubRoutingService);
export { HubRoutingService };
//# sourceMappingURL=hub-routing.service.js.map