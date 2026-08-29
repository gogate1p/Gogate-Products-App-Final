import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTenant(name: string, domain?: string, config?: any) {
    return this.prisma.tenant.create({
      data: {
        name,
        domain,
        config: config || {},
      },
    });
  }

  async getAllTenants() {
    return this.prisma.tenant.findMany();
  }

  async getTenantById(id: string) {
    return this.prisma.tenant.findUnique({ where: { id } });
  }
}
