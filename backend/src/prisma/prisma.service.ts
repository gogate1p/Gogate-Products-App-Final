import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Prisma connects lazily on the first database query. Avoid eager
  // connection during Vercel serverless cold starts.
  async onModuleInit() {}

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
