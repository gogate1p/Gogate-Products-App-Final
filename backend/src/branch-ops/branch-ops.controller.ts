import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  AuthGuard,
} from '@nestjs/passport';

import {
  BranchOpsService,
} from './branch-ops.service.js';

@Controller('branch-ops')
export class BranchOpsController {
  constructor(
    private readonly service:
      BranchOpsService,
  ) {}

  private userId(req: any) {
    return (
      req.user?.userId ??
      req.user?.sub ??
      req.user?.id
    );
  }

  @Post('login')
  login(
    @Body()
    body: any,
  ) {
    return this.service.login(
      body,
    );
  }

  @Get('me')
  @UseGuards(
    AuthGuard('branch-jwt'),
  )
  me(
    @Req()
    req: any,
  ) {
    return this.service.me(
      this.userId(req),
    );
  }

  @Get('branches')
  @UseGuards(
    AuthGuard('branch-jwt'),
  )
  branches(
    @Req()
    req: any,
  ) {
    return this.service.branches(
      this.userId(req),
    );
  }

  @Post('branches')
  @UseGuards(
    AuthGuard('branch-jwt'),
  )
  createBranch(
    @Req()
    req: any,

    @Body()
    body: any,
  ) {
    return this.service.createBranch(
      this.userId(req),
      body,
    );
  }

  @Get('dashboard')
  @UseGuards(
    AuthGuard('branch-jwt'),
  )
  dashboard(
    @Req()
    req: any,

    @Headers('x-branch-id')
    branchId: string,
  ) {
    return this.service.dashboard(
      this.userId(req),
      branchId,
    );
  }

  @Get('pickups')
  @UseGuards(
    AuthGuard('branch-jwt'),
  )
  pickups(
    @Req()
    req: any,

    @Headers('x-branch-id')
    branchId: string,
  ) {
    return this.service.pickups(
      this.userId(req),
      branchId,
    );
  }

  @Post('pickups')
  @UseGuards(
    AuthGuard('branch-jwt'),
  )
  createPickup(
    @Req()
    req: any,

    @Headers('x-branch-id')
    branchId: string,

    @Body()
    body: any,
  ) {
    return this.service.createPickup(
      this.userId(req),
      branchId,
      body,
    );
  }

  @Get('shipments')
  @UseGuards(
    AuthGuard('branch-jwt'),
  )
  shipments(
    @Req()
    req: any,

    @Headers('x-branch-id')
    branchId: string,
  ) {
    return this.service.shipments(
      this.userId(req),
      branchId,
    );
  }

  @Post('shipments')
  @UseGuards(
    AuthGuard('branch-jwt'),
  )
  createShipment(
    @Req()
    req: any,

    @Headers('x-branch-id')
    branchId: string,

    @Body()
    body: any,
  ) {
    return this.service.createShipment(
      this.userId(req),
      branchId,
      body,
    );
  }

  @Get('users')
  @UseGuards(
    AuthGuard('branch-jwt'),
  )
  users(
    @Req()
    req: any,

    @Headers('x-branch-id')
    branchId: string,
  ) {
    return this.service.users(
      this.userId(req),
      branchId,
    );
  }

  @Post('users')
  @UseGuards(
    AuthGuard('branch-jwt'),
  )
  createUser(
    @Req()
    req: any,

    @Headers('x-branch-id')
    branchId: string,

    @Body()
    body: any,
  ) {
    return this.service.createUser(
      this.userId(req),
      branchId,
      body,
    );
  }
}