import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  AuthGuard,
} from '@nestjs/passport';

import {
  HubOpsService,
} from './hub-ops.service.js';

@Controller('hub-ops')
@UseGuards(AuthGuard('jwt'))
export class HubOpsController {
  constructor(
    private readonly service:
      HubOpsService,
  ) {}

  private userId(req: any) {
    return (
      req.user?.userId ??
      req.user?.sub ??
      req.user?.id
    );
  }

  @Get('hubs')
  hubs(
    @Req() req: any,
  ) {
    return this.service.hubs(
      this.userId(req),
    );
  }

  @Get('me')
  me(
    @Req() req: any,

    @Headers('x-hub-id')
    hubId: string,
  ) {
    return this.service.me(
      this.userId(req),
      hubId,
    );
  }

  @Get('dashboard')
  dashboard(
    @Req() req: any,

    @Headers('x-hub-id')
    hubId: string,
  ) {
    return this.service.dashboard(
      this.userId(req),
      hubId,
    );
  }

  @Get('riders')
  riders(
    @Req() req: any,

    @Headers('x-hub-id')
    hubId: string,
  ) {
    return this.service.riders(
      this.userId(req),
      hubId,
    );
  }

  @Post('riders')
  createRider(
    @Req() req: any,

    @Headers('x-hub-id')
    hubId: string,

    @Body()
    body: any,
  ) {
    return this.service.createRider(
      this.userId(req),
      hubId,
      body,
    );
  }

  @Patch('location')
  location(
    @Req() req: any,

    @Headers('x-hub-id')
    hubId: string,

    @Body()
    body: any,
  ) {
    return this.service.updateLocation(
      this.userId(req),
      hubId,
      body,
    );
  }

  @Get('inbound')
  inbound(
    @Req() req: any,
    @Headers('x-hub-id')
    hubId: string,
  ) {
    return this.service.inbound(
      this.userId(req),
      hubId,
    );
  }

  @Get('outbound')
  outbound(
    @Req() req: any,
    @Headers('x-hub-id')
    hubId: string,
  ) {
    return this.service.outbound(
      this.userId(req),
      hubId,
    );
  }

  @Get('manifests')
  manifests(
    @Req() req: any,
    @Headers('x-hub-id')
    hubId: string,
  ) {
    return this.service.manifests(
      this.userId(req),
      hubId,
    );
  }

  @Get('bags')
  bags(
    @Req() req: any,
    @Headers('x-hub-id')
    hubId: string,
  ) {
    return this.service.bags(
      this.userId(req),
      hubId,
    );
  }

  @Get('capacity')
  capacity(
    @Req() req: any,
    @Headers('x-hub-id')
    hubId: string,
  ) {
    return this.service.capacity(
      this.userId(req),
      hubId,
    );
  }

  @Get('exceptions')
  exceptions(
    @Req() req: any,
    @Headers('x-hub-id')
    hubId: string,
  ) {
    return this.service.exceptions(
      this.userId(req),
      hubId,
    );
  }
}