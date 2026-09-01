import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import {
  PidgeService,
} from './pidge.service.js';

import type {
  PidgeCreateOrderInput,
} from './pidge.types.js';

@Controller('integrations/pidge')
export class PidgeController {
  constructor(
    private readonly pidge:
      PidgeService,
  ) {}

  @Post('orders')
  createOrder(
    @Body()
    body:
      PidgeCreateOrderInput,
  ) {
    return this.pidge
      .createOrder(body);
  }

  @Post('orders/allocate')
  allocateOrder(
    @Body()
    body:
      Record<string, unknown>,
  ) {
    return this.pidge
      .allocateOrder(body);
  }

  @Get('orders/:id')
  getOrder(
    @Param('id')
    id:
      string,
  ) {
    return this.pidge
      .getOrder(id);
  }

  @Post('orders/:id/cancel')
  cancelOrder(
    @Param('id')
    id:
      string,

    @Body()
    body:
      { reason?: string },
  ) {
    return this.pidge
      .cancelOrder(
        id,
        body?.reason,
      );
  }

  @Post('routes')
  createRoute(
    @Body()
    body:
      Record<string, unknown>,
  ) {
    return this.pidge
      .createRoute(body);
  }
}