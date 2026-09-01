import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  AuthGuard,
} from '@nestjs/passport';

import {
  HubRoutingService,
} from './hub-routing.service.js';

@Controller('hub-routing')
@UseGuards(
  AuthGuard('portal-jwt'),
)
export class HubRoutingController {
  constructor(
    private readonly service:
      HubRoutingService,
  ) {}

  @Get('shipment/:awb')
  shipment(
    @Param('awb')
    awb: string,
  ) {
    return this.service.instruction(
      awb,
    );
  }

  @Post('shipment/:awb/refresh')
  refresh(
    @Param('awb')
    awb: string,
  ) {
    return this.service.refresh(
      awb,
    );
  }

  @Get('hub/:hubId/queue')
  queue(
    @Param('hubId')
    hubId: string,
  ) {
    return this.service.hubQueue(
      hubId,
    );
  }
}