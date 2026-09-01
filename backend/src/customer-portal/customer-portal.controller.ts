import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  AuthGuard,
} from '@nestjs/passport';

import {
  CustomerPortalService,
} from './customer-portal.service.js';

@Controller('customer-portal')
@UseGuards(
  AuthGuard('portal-jwt'),
)
export class CustomerPortalController {
  constructor(
    private readonly service:
      CustomerPortalService,
  ) {}

  private userId(req: any) {
    return (
      req.user?.id ??
      req.user?.userId ??
      req.user?.sub
    );
  }

  @Get('me')
  me(@Req() req: any) {
    return this.service.me(
      this.userId(req),
    );
  }

  @Get('dashboard')
  dashboard(@Req() req: any) {
    return this.service.dashboard(
      this.userId(req),
    );
  }

  @Get('addresses')
  addresses(@Req() req: any) {
    return this.service.addresses(
      this.userId(req),
    );
  }

  @Post('addresses')
  createAddress(
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.service.createAddress(
      this.userId(req),
      body,
    );
  }

  @Delete('addresses/:id')
  deleteAddress(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.service.deleteAddress(
      this.userId(req),
      id,
    );
  }

  @Patch('addresses/:id/default')
  defaultAddress(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.service.setDefaultAddress(
      this.userId(req),
      id,
    );
  }

  @Get('shipments')
  shipments(@Req() req: any) {
    return this.service.shipments(
      this.userId(req),
    );
  }

  @Post('shipments')
  createShipment(
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.service.createShipment(
      this.userId(req),
      body,
    );
  }

  @Get('payment-methods')
  paymentMethods(@Req() req: any) {
    return this.service.paymentMethods(
      this.userId(req),
    );
  }

  @Post('payment-methods')
  addPaymentMethod(
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.service.addPaymentMethod(
      this.userId(req),
      body,
    );
  }

  @Delete('payment-methods/:id')
  deletePaymentMethod(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.service.deletePaymentMethod(
      this.userId(req),
      id,
    );
  }

  @Get('support/tickets')
  tickets(@Req() req: any) {
    return this.service.tickets(
      this.userId(req),
    );
  }

  @Post('support/tickets')
  createTicket(
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.service.createTicket(
      this.userId(req),
      body,
    );
  }

  @Get('support/tickets/:id/messages')
  messages(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.service.ticketMessages(
      this.userId(req),
      id,
    );
  }

  @Post('support/tickets/:id/messages')
  addMessage(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.service.addTicketMessage(
      this.userId(req),
      id,
      body,
    );
  }
}