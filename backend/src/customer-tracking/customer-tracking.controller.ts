import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  AuthGuard,
} from '@nestjs/passport';

import {
  CustomerTrackingService,
} from './customer-tracking.service.js';

@Controller('customer-tracking')
@UseGuards(
  AuthGuard('portal-jwt'),
)
export class CustomerTrackingController {
  constructor(
    private readonly service:
      CustomerTrackingService,
  ) {}

  @Get(':awb')
  get(
    @Req()
    req: any,

    @Param('awb')
    awb: string,
  ) {
    return this.service.details(
      req.user?.id ??
      req.user?.userId ??
      req.user?.sub,

      awb,
    );
  }
}