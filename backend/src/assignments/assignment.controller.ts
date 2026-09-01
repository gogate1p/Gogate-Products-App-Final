import {
  Body,
  Controller,
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
  AssignmentService,
} from './assignment.service.js';

@Controller('assignments')
@UseGuards(
  AuthGuard('portal-jwt'),
)
export class AssignmentController {
  constructor(
    private readonly service:
      AssignmentService,
  ) {}

  private userId(req: any) {
    return (
      req.user?.id ??
      req.user?.userId ??
      req.user?.sub
    );
  }

  @Get()
  list(
    @Req()
    req: any,
  ) {
    return this.service.list(
      this.userId(req),
    );
  }

  @Post()
  create(
    @Req()
    req: any,

    @Body()
    body: any,
  ) {
    return this.service.create(
      this.userId(req),
      body,
    );
  }

  @Patch(':id/deactivate')
  deactivate(
    @Req()
    req: any,

    @Param('id')
    id: string,
  ) {
    return this.service.deactivate(
      this.userId(req),
      id,
    );
  }

  @Get('me/current')
  mine(
    @Req()
    req: any,
  ) {
    return this.service.myAssignments(
      this.userId(req),
    );
  }

  @Get('admin/scopes')
  scopes(
    @Req()
    req: any,
  ) {
    return this.service.scopes(
      this.userId(req),
    );
  }
}