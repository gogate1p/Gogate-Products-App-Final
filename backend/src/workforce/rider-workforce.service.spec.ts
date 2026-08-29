import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { RiderWorkforceService } from './rider-workforce.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('RiderWorkforceService', () => {
  let service: RiderWorkforceService;
  let prisma: {
    $transaction: any;
    user: {
      findFirst: any;
      create: any;
    };
    riderProfile: {
      findFirst: any;
      create: any;
      update: any;
    };
    riderKyc: {
      create: any;
      findFirst: any;
    };
    activationPin: {
      create: any;
      findFirst: any;
      update: any;
      updateMany: any;
    };
    riderSlot: {
      create: any;
      findFirst: any;
      findMany: any;
    };
    hubCheckIn: {
      findFirst: any;
      create: any;
    };
  };

  beforeEach(async () => {
    prisma = {
      $transaction: vi.fn(async (cb) => cb({
        $queryRawUnsafe: vi.fn().mockResolvedValue(null),
        riderSlot: {
          findMany: vi.fn().mockResolvedValue([]),
          create: vi.fn().mockResolvedValue({ id: 'slot-1', status: 'BOOKED', capacity: 1, bookedCount: 1 }),
        },
      })),
      user: {
        findFirst: vi.fn(),
        create: vi.fn(),
      },
      riderProfile: {
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      riderKyc: {
        create: vi.fn(),
        findFirst: vi.fn(),
      },
      activationPin: {
        create: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
      riderSlot: {
        create: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
      hubCheckIn: {
        findFirst: vi.fn(),
        create: vi.fn(),
      },
    };

    prisma.riderProfile.findFirst.mockResolvedValue({ id: 'rider-1', tenantId: 'tenant-1' });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiderWorkforceService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<RiderWorkforceService>(RiderWorkforceService);
  });

  it('signs up a rider applicant without allowing duplicate phone registration', async () => {
    prisma.user.findFirst.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 'user-1', phone: '+10000000000', tenantId: 'tenant-1' });
    prisma.riderProfile.create.mockResolvedValue({ id: 'rider-1', userId: 'user-1', riderState: 'APPLICANT' });

    const result = await service.signupRider({
      tenantId: 'tenant-1',
      name: 'Asha Rider',
      email: 'asha@example.com',
      phone: '+10000000000',
      passwordHash: 'hashed',
      preferredHubId: 'hub-1',
    });

    expect(result.riderState).toBe('APPLICANT');
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('creates a KYC record for a submitted rider profile', async () => {
    prisma.riderProfile.findFirst.mockResolvedValue({ id: 'rider-1', tenantId: 'tenant-1', userId: 'user-1' });
    prisma.riderKyc.create.mockResolvedValue({ id: 'kyc-1', riderProfileId: 'rider-1', status: 'SUBMITTED' });

    const result = await service.submitKyc({ riderProfileId: 'rider-1', tenantId: 'tenant-1', userId: 'user-1' });

    expect(result.status).toBe('SUBMITTED');
    expect(prisma.riderKyc.create).toHaveBeenCalled();
  });

  it('returns ALREADY_CHECKED_IN when the same rider slot is checked in twice', async () => {
    prisma.riderProfile.findFirst.mockResolvedValue({ id: 'rider-1', tenantId: 'tenant-1', userId: 'user-1' });
    prisma.hubCheckIn.findFirst.mockResolvedValue({ id: 'checkin-1' });

    const result = await service.checkInRider({
      tenantId: 'tenant-1',
      riderProfileId: 'rider-1',
      userId: 'user-1',
      hubId: 'hub-1',
      slotId: 'slot-1',
      lat: 12.9,
      lng: 77.6,
      gpsAccuracy: 10,
      deviceId: 'device-1',
    });

    expect(result.result).toBe('ALREADY_CHECKED_IN');
  });

  it('rejects KYC submission when the rider profile does not belong to the authenticated user', async () => {
    prisma.riderProfile.findFirst.mockResolvedValue({ id: 'rider-2', tenantId: 'tenant-1', userId: 'user-2' });

    await expect(
      service.submitKyc({
        tenantId: 'tenant-1',
        riderProfileId: 'rider-1',
        userId: 'user-1',
      }),
    ).rejects.toThrow('RIDER_PROFILE_NOT_ACCESSIBLE');
  });

  it('checks in only an assigned rider profile and ignores a mismatched user-provided rider id', async () => {
    prisma.riderProfile.findFirst.mockResolvedValue({ id: 'rider-2', tenantId: 'tenant-1', userId: 'user-1' });
    prisma.hubCheckIn.findFirst.mockResolvedValue(null);
    prisma.hubCheckIn.create.mockResolvedValue({ id: 'checkin-2', riderProfileId: 'rider-2', result: 'CHECKED_IN' });

    const result = await service.checkInRider({
      tenantId: 'tenant-1',
      riderProfileId: 'rider-1',
      userId: 'user-1',
      hubId: 'hub-1',
      slotId: 'slot-1',
      lat: 12.9,
      lng: 77.6,
      gpsAccuracy: 10,
      deviceId: 'device-1',
    });

    expect(result.result).toBe('CHECKED_IN');
    expect(prisma.hubCheckIn.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ riderProfileId: 'rider-2' }) }));
  });

  it('stores activation pins as a bcrypt hash and rejects expired or invalid attempts', async () => {
    prisma.riderProfile.findFirst.mockResolvedValue({ id: 'rider-1', tenantId: 'tenant-1', userId: 'user-1', primaryHubId: 'hub-1' });
    prisma.activationPin.create.mockResolvedValue({ id: 'pin-1', riderProfileId: 'rider-1', status: 'ACTIVE' });

    await service.generateActivationPin('tenant-1', 'hub-1', 'HUB_MANAGER', 'rider-1');

    expect(prisma.activationPin.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          hash: expect.stringMatching(/^\$2[aby]\$/),
          status: 'ACTIVE',
        }),
      }),
    );

    const validHash = await bcrypt.hash('123456', 10);
    prisma.activationPin.findFirst
      .mockResolvedValueOnce({
        id: 'pin-1',
        riderProfileId: 'rider-1',
        tenantId: 'tenant-1',
        hash: validHash,
        attempts: 2,
        maxAttempts: 5,
        expiresAt: new Date(Date.now() - 5000),
        status: 'ACTIVE',
      })
      .mockResolvedValueOnce({
        id: 'pin-1',
        riderProfileId: 'rider-1',
        tenantId: 'tenant-1',
        hash: validHash,
        attempts: 2,
        maxAttempts: 5,
        expiresAt: new Date(Date.now() + 60_000),
        status: 'ACTIVE',
      });

    await expect(service.activateRider('tenant-1', 'user-1', '123456')).rejects.toThrow('ACTIVATION_PIN_EXPIRED');
    await expect(service.activateRider('tenant-1', 'user-1', '000000')).rejects.toThrow('ACTIVATION_PIN_INVALID');
  });

  it('books slots inside a transaction and rejects overlap before creating a reservation', async () => {
    const tx = {
      $queryRawUnsafe: vi.fn().mockResolvedValue(null),
      riderSlot: {
        findMany: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockResolvedValue({ id: 'slot-1', status: 'BOOKED', capacity: 2, bookedCount: 2 }),
      },
    };
    prisma.riderProfile.findFirst.mockResolvedValue({ id: 'rider-1', tenantId: 'tenant-1', userId: 'user-1' });
    prisma.$transaction.mockImplementation(async (callback) => callback(tx));

    const result = await service.bookSlot('tenant-1', 'user-1', {
      hubId: 'hub-1',
      date: new Date(Date.now() + 86_400_000).toISOString(),
      startTime: new Date(Date.now() + 86_400_000).toISOString(),
      endTime: new Date(Date.now() + 86_500_000).toISOString(),
      capacity: 2,
    });

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(tx.riderSlot.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        capacity: 2,
        bookedCount: 2,
      }),
    }));
    expect(result.capacity).toBe(2);

    tx.riderSlot.findMany.mockResolvedValue([{ id: 'existing-slot', startTime: new Date(Date.now() + 86_400_000), endTime: new Date(Date.now() + 86_500_000), status: 'BOOKED' }]);
    await expect(
      service.bookSlot('tenant-1', 'user-1', {
        hubId: 'hub-1',
        date: new Date(Date.now() + 86_400_000).toISOString(),
        startTime: new Date(Date.now() + 86_400_000).toISOString(),
        endTime: new Date(Date.now() + 86_500_000).toISOString(),
        capacity: 1,
      }),
    ).rejects.toThrow('DUPLICATE_SLOT');
  });

  it('blocks slots outside the future and rejects duplicate overlapping booking requests', async () => {
    prisma.riderProfile.findFirst.mockResolvedValue({ id: 'rider-1', tenantId: 'tenant-1', userId: 'user-1' });
    const tx = {
      $queryRawUnsafe: vi.fn().mockResolvedValue(null),
      riderSlot: {
        findMany: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockResolvedValue({ id: 'slot-1', status: 'BOOKED', capacity: 1, bookedCount: 1 }),
      },
    };
    prisma.$transaction.mockImplementation(async (callback) => callback(tx));

    await expect(
      service.bookSlot('tenant-1', 'user-1', {
        hubId: 'hub-1',
        date: new Date(Date.now() - 60_000).toISOString(),
        startTime: new Date(Date.now() - 30_000).toISOString(),
        endTime: new Date(Date.now()).toISOString(),
        capacity: 1,
      }),
    ).rejects.toThrow('SLOT_MUST_BE_IN_FUTURE');

    tx.riderSlot.findMany.mockResolvedValue([{ id: 'existing-slot', startTime: new Date(Date.now() + 86_400_000), endTime: new Date(Date.now() + 86_500_000), status: 'BOOKED' }]);
    await expect(
      service.bookSlot('tenant-1', 'user-1', {
        hubId: 'hub-1',
        date: new Date(Date.now() + 86_400_000).toISOString(),
        startTime: new Date(Date.now() + 86_400_000).toISOString(),
        endTime: new Date(Date.now() + 86_500_000).toISOString(),
        capacity: 1,
      }),
    ).rejects.toThrow('DUPLICATE_SLOT');
  });
});
