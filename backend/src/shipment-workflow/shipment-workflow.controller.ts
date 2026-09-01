import {
  Body,
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
  ShipmentWorkflowService,
} from './shipment-workflow.service.js';

@Controller('shipment-workflow')
@UseGuards(
  AuthGuard('portal-jwt'),
)
export class ShipmentWorkflowController {
  constructor(
    private readonly service:
      ShipmentWorkflowService,
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

  @Post('scan')
  scan(
    @Req()
    req: any,

    @Body()
    body: any,
  ) {
    return this.service.scan(
      this.userId(req),
      body,
    );
  }

  @Get('resolve/:code')
  async resolve(
    @Param('code')
    code: string,
  ) {
    const shipment =
      await this.service.resolveShipment(
        code,
      );

    return this.service.scanResult(
      shipment.awb,
    );
  }
}