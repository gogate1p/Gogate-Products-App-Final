import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PackageScanningService } from './package-scanning.service.js';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packageScanningService: PackageScanningService) {}

  @Get(':id')
  async getPackage(@Param('id') id: string, @Body('tenantId') tenantId: string) {
    return this.packageScanningService.getPackageById(id, tenantId);
  }

  @Get(':id/scans')
  async getPackageScans(@Param('id') id: string, @Body('tenantId') tenantId: string) {
    return this.packageScanningService.getPackageHistory(id, tenantId);
  }

  @Post('scan')
  async scanPackage(@Body() request: any) {
    return this.packageScanningService.scanPackage(request);
  }

  @Post('scan/batch')
  async scanBatch(@Body('requests') requests: any[]) {
    return this.packageScanningService.scanBatch(requests ?? []);
  }
}
