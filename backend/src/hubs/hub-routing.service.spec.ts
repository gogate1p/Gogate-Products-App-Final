import { HubRoutingService } from './hub-routing.service.js';

describe('HubRoutingService', () => {
  it('selects a valid dynamic route through the network lanes', async () => {
    const prisma = {
      hubNetworkLane: {
        findMany: vi.fn().mockResolvedValue([
          { id: 'lane-1', fromHubId: 'origin', toHubId: 'city', active: true, priority: 1, serviceTypes: ['NORMAL'], distanceKm: 10, expectedTransitMinutes: 40 },
          { id: 'lane-2', fromHubId: 'city', toHubId: 'transit', active: true, priority: 2, serviceTypes: ['NORMAL'], distanceKm: 20, expectedTransitMinutes: 60 },
          { id: 'lane-3', fromHubId: 'transit', toHubId: 'destination', active: true, priority: 3, serviceTypes: ['NORMAL'], distanceKm: 30, expectedTransitMinutes: 90 },
        ]),
      },
      hubCapacity: {
        findMany: vi.fn().mockResolvedValue([
          { hubId: 'origin', capacity: 100, used: 10, status: 'OPEN' },
          { hubId: 'city', capacity: 100, used: 20, status: 'OPEN' },
          { hubId: 'transit', capacity: 100, used: 15, status: 'OPEN' },
          { hubId: 'destination', capacity: 100, used: 25, status: 'OPEN' },
        ]),
      },
    } as any;

    const service = new HubRoutingService(prisma);
    const route = await service.getRoute({
      tenantId: 'tenant-1',
      fromHubId: 'origin',
      toHubId: 'destination',
      serviceType: 'NORMAL',
    });

    expect(route.path).toEqual(['origin', 'city', 'transit', 'destination']);
    expect(route.lanes.length).toBeGreaterThan(0);
    expect(route.valid).toBe(true);
  });

  it('returns invalid when no active lane exists between hubs', async () => {
    const prisma = {
      hubNetworkLane: {
        findMany: vi.fn().mockResolvedValue([]),
      },
      hubCapacity: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    } as any;

    const service = new HubRoutingService(prisma);
    const route = await service.getRoute({
      tenantId: 'tenant-1',
      fromHubId: 'origin',
      toHubId: 'destination',
      serviceType: 'NORMAL',
    });

    expect(route.valid).toBe(false);
    expect(route.path).toEqual([]);
  });
});
