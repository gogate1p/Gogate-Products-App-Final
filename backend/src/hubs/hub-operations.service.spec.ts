import { HubOperationsService } from './hub-operations.service.js';

describe('HubOperationsService', () => {
  it('receives an inbound package for the correct tenant hub', async () => {
    const prisma = {
      hub: {
        findFirst: vi.fn().mockResolvedValue({ id: 'hub-1', tenantId: 'tenant-1' }),
      },
      package: {
        findFirst: vi.fn().mockResolvedValue({ id: 'pkg-1', tenantId: 'tenant-1' }),
      },
      bag: {
        findFirst: vi.fn(),
      },
      manifest: {
        findFirst: vi.fn(),
      },
    } as any;

    const service = new HubOperationsService(prisma);
    const result = await service.receiveInbound({
      tenantId: 'tenant-1',
      actorUserId: 'user-1',
      hubId: 'hub-1',
      packageId: 'pkg-1',
    });

    expect(result.type).toBe('PACKAGE');
    expect(result.status).toBe('RECEIVED');
  });
});
