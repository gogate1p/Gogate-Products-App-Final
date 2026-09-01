import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import {
  TrackingService,
} from './tracking.service.js';

@Controller('tracking')
export class TrackingController {
  constructor(
    private readonly service:
      TrackingService,
  ) {}

  @Get(':awb')
  track(
    @Param('awb')
    awb: string,
  ) {
    return this.service.publicTrack(
      awb,
    );
  }
}