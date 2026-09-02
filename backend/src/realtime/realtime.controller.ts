import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocationPing, RealtimeService } from './realtime.service.js';

@Controller('realtime')
@UseGuards(AuthGuard('portal-jwt'))
export class RealtimeController {
  constructor(private readonly realtime: RealtimeService) {}

  @Post('hyperlocal/location')
  ingest(@Req() req: any, @Body() body: LocationPing) {
    return this.realtime.ingest(req.user?.id ?? req.user?.userId ?? req.user?.sub, req.user?.tenantId, body);
  }

  @Get('hyperlocal/:awb/latest')
  latest(@Req() req: any, @Param('awb') awb: string) {
    return this.realtime.latest(req.user?.id ?? req.user?.userId ?? req.user?.sub, req.user?.tenantId, awb);
  }
}
