import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  AuthGuard,
} from '@nestjs/passport';

import {
  CustomerShipmentDetailService,
} from './customer-shipment-detail.service.js';

@Controller('customer-shipments')
@UseGuards(
  AuthGuard('portal-jwt'),
)
export class CustomerShipmentDetailController {
  constructor(
    private readonly service:
      CustomerShipmentDetailService,
  ) {}

  private userId(
    req: any,
  ) {
    return (
      req.user?.id ??
      req.user?.userId ??
      req.user?.sub
    );
  }

  @Get(':awb')
  detail(
    @Req() req: any,

    @Param('awb')
    awb: string,
  ) {
    return this.service.detail(
      this.userId(req),
      awb,
    );
  }

  @Post(':awb/otp/:type')
  otp(
    @Req() req: any,

    @Param('awb')
    awb: string,

    @Param('type')
    type: string,
  ) {
    return this.service.issueOtp(
      this.userId(req),
      awb,
      type,
    );
  }
}