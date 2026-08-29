import { Test, TestingModule } from '@nestjs/testing';
import { TenantsController } from './tenants.controller.js';
import { TenantsService } from './tenants.service.js';

describe('TenantsController', () => {
  let controller: TenantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsController],
      providers: [{
        provide: TenantsService,
        useValue: {
          createTenant: vi.fn(),
          getAllTenants: vi.fn(),
          getTenantById: vi.fn(),
        },
      }],
    }).compile();

    controller = module.get<TenantsController>(TenantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
