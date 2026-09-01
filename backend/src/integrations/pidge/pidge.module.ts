import {
  Module,
} from '@nestjs/common';

import {
  PidgeController,
} from './pidge.controller.js';

import {
  PidgeService,
} from './pidge.service.js';

@Module({
  controllers: [
    PidgeController,
  ],

  providers: [
    PidgeService,
  ],

  exports: [
    PidgeService,
  ],
})
export class PidgeModule {}