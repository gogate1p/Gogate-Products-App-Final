import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import {
  PublicTrackingService,
} from './public-tracking.service.js';

@Controller('public-tracking')
export class PublicTrackingController {
  constructor(
    private readonly service:
      PublicTrackingService,
  ) {}

  @Get(':awb')
  track(
    @Param('awb')
    awb: string,
  ) {
    return this.service.track(
      awb,
    );
  }
}