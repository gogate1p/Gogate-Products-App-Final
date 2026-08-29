import { PackageScanningService } from './package-scanning.service.js';

describe('PackageScanningService', () => {
  it('uses the centralized scan resolver to recognize an AWB', async () => {
    const prisma = {
      shipment: { findFirst: vi.fn().mockResolvedValue({ id: 'shipment-1', awb: 'AWB123', currentHubId: 'hub-1', destinationHubId: 'hub-2' }) },
      package: {
        findFirst: vi.fn().mockResolvedValue({
          id: 'pkg-1',
          tenantId: 't-1',
          shipmentId: 'shipment-1',
          barcode: 'AWB123',
          shipment: { id: 'shipment-1', awb: 'AWB123', currentHubId: 'hub-1', destinationHubId: 'hub-2' },
        }),
      },
      bag: { findUnique: vi.fn() },
      manifest: { findUnique: vi.fn() },
      user: { findFirst: vi.fn().mockResolvedValue({ id: 'user-1', tenantId: 't-1', status: 'ACTIVE', role: 'RIDER' }) },
      packageScan: { findFirst: vi.fn().mockResolvedValue(null) },
      hub: { findFirst: vi.fn().mockResolvedValue({ id: 'hub-1', tenantId: 't-1' }) },
      runsheet: { findFirst: vi.fn().mockResolvedValue({ id: 'runsheet-1', tenantId: 't-1', riderId: 'user-1', status: 'ASSIGNED' }) },
      $transaction: vi.fn(async (cb) => cb({
        packageScan: {
          create: vi.fn().mockResolvedValue({ id: 'scan-1', status: 'VALID', idempotencyKey: 'scan-1' }),
          findFirst: vi.fn().mockResolvedValue(null),
        },
        package: { update: vi.fn().mockResolvedValue({ id: 'pkg-1', status: 'AT_HUB' }) },
        shipmentEvent: { create: vi.fn().mockResolvedValue({ id: 'event-1' }) },
      })),
    } as any;

    const eventsService = { emitShipmentEvent: vi.fn().mockResolvedValue({ id: 'event-2' }) } as any;
    const scanResolver = { resolve: vi.fn().mockResolvedValue({ kind: 'AWB', shipmentId: 'shipment-1' }) } as any;
    const service = new PackageScanningService(prisma, eventsService, scanResolver);

    const result = await service.scanPackage({
      tenantId: 't-1',
      actorUserId: 'user-1',
      actorRole: 'RIDER',
      hubId: 'hub-1',
      scanType: 'PACKAGE_SCAN',
      scanValue: 'AWB123',
      idempotencyKey: 'scan-1',
      metadata: { source: 'mobile' },
    });

    expect(result.status).toBe('NEW');
    expect(scanResolver.resolve).toHaveBeenCalledWith('AWB123');
  });

  it('returns ALREADY_PROCESSED for duplicate idempotent scans', async () => {
    const prisma = {
      user: { findFirst: vi.fn().mockResolvedValue({ id: 'user-1', tenantId: 't-1', status: 'ACTIVE', role: 'RIDER' }) },
      package: { findFirst: vi.fn().mockResolvedValue({ id: 'pkg-1', tenantId: 't-1', shipmentId: 'shipment-1', shipment: { id: 'shipment-1', currentHubId: 'hub-1', destinationHubId: 'hub-2' } }) },
      hub: { findFirst: vi.fn().mockResolvedValue({ id: 'hub-1', tenantId: 't-1' }) },
      packageScan: { findFirst: vi.fn().mockResolvedValue({ id: 'existing-scan', idempotencyKey: 'scan-1' }) },
      shipment: { findFirst: vi.fn().mockResolvedValue({ id: 'shipment-1', awb: 'AWB123', currentHubId: 'hub-1', destinationHubId: 'hub-2' }) },
      bag: { findUnique: vi.fn() },
      manifest: { findUnique: vi.fn() },
      runsheet: { findFirst: vi.fn().mockResolvedValue({ id: 'runsheet-1', tenantId: 't-1', riderId: 'user-1' }) },
      $transaction: vi.fn(),
    } as any;

    const service = new PackageScanningService(prisma, { emitShipmentEvent: vi.fn() } as any, { resolve: vi.fn().mockResolvedValue({ kind: 'AWB', shipmentId: 'shipment-1' }) } as any);

    const result = await service.scanPackage({
      tenantId: 't-1',
      actorUserId: 'user-1',
      actorRole: 'RIDER',
      hubId: 'hub-1',
      scanType: 'PACKAGE_SCAN',
      scanValue: 'AWB123',
      idempotencyKey: 'scan-1',
    });

    expect(result.status).toBe('ALREADY_PROCESSED');
    expect(result.message).toBe('ALREADY_PROCESSED');
  });

  it('rejects scans arriving at a hub that is not expected for the package', async () => {
    const prisma = {
      user: { findFirst: vi.fn().mockResolvedValue({ id: 'user-1', tenantId: 't-1', status: 'ACTIVE', role: 'RIDER' }) },
      package: { findFirst: vi.fn().mockResolvedValue({ id: 'pkg-1', tenantId: 't-1', shipmentId: 'shipment-1', barcode: 'AWB123', shipment: { id: 'shipment-1', currentHubId: 'hub-1', destinationHubId: 'hub-2' } }) },
      hub: { findFirst: vi.fn().mockResolvedValue({ id: 'hub-9', tenantId: 't-1' }) },
      packageScan: { findFirst: vi.fn().mockResolvedValue(null) },
      shipment: { findFirst: vi.fn().mockResolvedValue({ id: 'shipment-1', awb: 'AWB123', currentHubId: 'hub-1', destinationHubId: 'hub-2' }) },
      bag: { findUnique: vi.fn() },
      manifest: { findUnique: vi.fn() },
      runsheet: { findFirst: vi.fn().mockResolvedValue({ id: 'runsheet-1', tenantId: 't-1', riderId: 'user-1' }) },
      $transaction: vi.fn(),
    } as any;

    const service = new PackageScanningService(prisma, { emitShipmentEvent: vi.fn() } as any, { resolve: vi.fn().mockResolvedValue({ kind: 'AWB', shipmentId: 'shipment-1' }) } as any);

    await expect(service.scanPackage({
      tenantId: 't-1',
      actorUserId: 'user-1',
      actorRole: 'RIDER',
      hubId: 'hub-9',
      scanType: 'PACKAGE_SCAN',
      scanValue: 'AWB123',
    })).rejects.toMatchObject({ response: { message: 'PACKAGE_NOT_EXPECTED_AT_HUB' } });
  });
});
