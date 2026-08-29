import { Test, TestingModule } from '@nestjs/testing';
import { RunsheetsController } from './runsheets.controller.js';

describe('RunsheetsController', () => {
  let controller: RunsheetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunsheetsController],
    }).compile();

    controller = module.get<RunsheetsController>(RunsheetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
