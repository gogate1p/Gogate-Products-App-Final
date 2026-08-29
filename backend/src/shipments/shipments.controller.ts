import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ShipmentsService } from './shipments.service.js';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post()
  async createShipment(@Body() body: any) {
    return this.shipmentsService.createShipment(body);
  }

  @Get(':awb/track')
  async trackShipment(@Param('awb') awb: string) {
    return this.shipmentsService.trackShipment(awb);
  }

  @Patch(':id/out-for-delivery')
  async markOutForDelivery(@Param('id') id: string, @Body('riderId') riderId: string) {
    return this.shipmentsService.markOutForDelivery(id, riderId);
  }

  @Patch(':id/deliver')
  async markDelivered(
    @Param('id') id: string,
    @Body('riderId') riderId: string,
    @Body('lat') lat?: number,
    @Body('lng') lng?: number,
  ) {
    return this.shipmentsService.markDelivered(id, riderId, lat, lng);
  }
}
