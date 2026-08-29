import { Test, TestingModule } from '@nestjs/testing';
import { TenantsService } from './tenants.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('TenantsService', () => {
  let service: TenantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        {
          provide: PrismaService,
          useValue: {
            tenant: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<TenantsService>(TenantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
