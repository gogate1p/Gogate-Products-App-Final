import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import {
  PublicSignupService,
} from './public-signup.service.js';

@Controller('public-auth')
export class PublicSignupController {
  constructor(
    private readonly service:
      PublicSignupService,
  ) {}

  @Post('signup')
  signup(
    @Body()
    body: any,
  ) {
    return this.service.signup(
      body,
    );
  }
}