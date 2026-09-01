import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req
} from '@nestjs/common';

import {
  TruckDriverService
} from './truck-driver.service.js';

@Controller('truck-driver')
export class TruckDriverController {

  constructor(
    private readonly service:
      TruckDriverService
  ) {}

  private userId(
    req: any
  ) {

    return (
      req.user?.userId ??
      req.user?.sub ??
      req.user?.id
    );
  }

  @Get('me')
  me(
    @Req() req: any
  ) {
    return this.service.me(
      this.userId(req)
    );
  }

  @Get('dashboard')
  dashboard(
    @Req() req: any
  ) {
    return this.service.dashboard(
      this.userId(req)
    );
  }

  @Get('vehicle')
  vehicle(
    @Req() req: any
  ) {
    return this.service.vehicle(
      this.userId(req)
    );
  }

  @Get('manifests')
  manifests(
    @Req() req: any
  ) {
    return this.service.manifests(
      this.userId(req)
    );
  }

  @Get('manifests/:id')
  manifest(
    @Req() req: any,
    @Param('id') id: string
  ) {
    return this.service.manifest(
      this.userId(req),
      id
    );
  }

  @Post('manifests/:id/start')
  start(
    @Req() req: any,
    @Param('id') id: string
  ) {
    return this.service.startManifest(
      this.userId(req),
      id
    );
  }

  @Post('manifests/:id/arrive')
  arrive(
    @Req() req: any,
    @Param('id') id: string
  ) {
    return this.service.arriveManifest(
      this.userId(req),
      id
    );
  }

  @Post('manifests/:id/complete')
  complete(
    @Req() req: any,
    @Param('id') id: string
  ) {
    return this.service.completeManifest(
      this.userId(req),
      id
    );
  }

  @Post('location')
  location(
    @Req() req: any,
    @Body() body: any
  ) {
    return this.service.location(
      this.userId(req),
      body
    );
  }

  @Post('scan')
  scan(
    @Req() req: any,
    @Body() body: any
  ) {
    return this.service.scan(
      this.userId(req),
      body
    );
  }
}