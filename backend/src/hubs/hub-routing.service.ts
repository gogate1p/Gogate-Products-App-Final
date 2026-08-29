import { Injectable } from '@nestjs/common';
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
  lanes: Array<{ fromHubId: string; toHubId: string; distanceKm?: number; expectedTransitMinutes?: number; priority?: number }>; 
  reason?: string;
};

@Injectable()
export class HubRoutingService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoute(request: HubRouteRequest): Promise<HubRouteResult> {
    const lanes = await this.prisma.hubNetworkLane.findMany({
      where: {
        tenantId: request.tenantId,
        active: true,
      },
    });

    const matchesService = (lane: any) =>
      !request.serviceType || lane.serviceTypes.length === 0 || lane.serviceTypes.includes(request.serviceType);

    const adjacency = new Map<string, any[]>();
    for (const lane of lanes) {
      if (!matchesService(lane)) continue;
      if (!adjacency.has(lane.fromHubId)) adjacency.set(lane.fromHubId, []);
      adjacency.get(lane.fromHubId)!.push(lane);
    }

    for (const outgoing of adjacency.values()) {
      outgoing.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    }

    const queue: Array<{ hubId: string; path: string[]; lanes: any[] }> = [{ hubId: request.fromHubId, path: [request.fromHubId], lanes: [] }];
    const visited = new Set<string>();

    while (queue.length) {
      const current = queue.shift()!;
      if (visited.has(current.hubId)) continue;
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
        if (visited.has(lane.toHubId)) continue;
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
}
