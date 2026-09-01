import {
  Module,
} from '@nestjs/common';

import {
  PrismaModule,
} from '../prisma/prisma.module.js';

import {
  AssignmentController,
} from './assignment.controller.js';

import {
  AssignmentService,
} from './assignment.service.js';

@Module({
  imports: [
    PrismaModule,
  ],

  controllers: [
    AssignmentController,
  ],

  providers: [
    AssignmentService,
  ],
})
export class AssignmentModule {}