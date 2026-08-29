import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentsService } from './shipments.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { EventsService } from '../events/events.service.js';

describe('ShipmentsService', () => {
  let service: ShipmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShipmentsService,
        {
          provide: PrismaService,
          useValue: {
            shipment: { create: vi.fn(), findUnique: vi.fn() },
          },
        },
        {
          provide: EventsService,
          useValue: { emitShipmentEvent: vi.fn() },
        },
      ],
    }).compile();

    service = module.get<ShipmentsService>(ShipmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
