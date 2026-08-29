import { Test, TestingModule } from '@nestjs/testing';
import { RunsheetsService } from './runsheets.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { EventsService } from '../events/events.service.js';

describe('RunsheetsService', () => {
  let service: RunsheetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RunsheetsService,
        {
          provide: PrismaService,
          useValue: {
            runsheet: { create: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
            shipment: { update: vi.fn() },
            runsheetShipment: { createMany: vi.fn() },
          },
        },
        {
          provide: EventsService,
          useValue: { emitShipmentEvent: vi.fn() },
        },
      ],
    }).compile();

    service = module.get<RunsheetsService>(RunsheetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
