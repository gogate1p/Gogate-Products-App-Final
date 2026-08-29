import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TenantsService } from './tenants.service.js';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  async createTenant(@Body() body: { name: string; domain?: string; config?: any }) {
    return this.tenantsService.createTenant(body.name, body.domain, body.config);
  }

  @Get()
  async getAllTenants() {
    return this.tenantsService.getAllTenants();
  }

  @Get(':id')
  async getTenantById(@Param('id') id: string) {
    return this.tenantsService.getTenantById(id);
  }
}
