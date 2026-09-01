import {
  Body,
  Controller,
  Get,
  Headers,
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
  PortalAuthService,
} from './portal-auth.service.js';

import {
  Roles,
} from './roles.decorator.js';

import {
  RolesGuard,
} from './roles.guard.js';

@Controller('portal-auth')
export class PortalAuthController {
  constructor(
    private readonly service:
      PortalAuthService,
  ) {}

  @Post('login')
  login(
    @Body()
    body: any,

    @Req()
    req: any,
  ) {
    return this.service.login(
      body,
      {
        userAgent:
          req.headers[
            'user-agent'
          ],

        ipAddress:
          req.ip,
      },
    );
  }

  @Post('refresh')
  refresh(
    @Body()
    body: any,
  ) {
    return this.service.refresh(
      body.refreshToken,
    );
  }

  @Get('me')
  @UseGuards(
    AuthGuard(
      'portal-jwt',
    ),
  )
  me(
    @Req()
    req: any,
  ) {
    return this.service.me(
      req.user.id,
    );
  }

  @Post('change-password')
  @UseGuards(
    AuthGuard(
      'portal-jwt',
    ),
  )
  changePassword(
    @Req()
    req: any,

    @Body()
    body: any,
  ) {
    return this.service.changePassword(
      req.user.id,
      body,
    );
  }

  @Post('logout')
  logout(
    @Body()
    body: any,
  ) {
    return this.service.logout(
      body.refreshToken,
    );
  }

  @Get('admin/users')
  @UseGuards(
    AuthGuard(
      'portal-jwt',
    ),
    RolesGuard,
  )
  @Roles(
    'SUPER_ADMIN',
    'ADMIN',
  )
  users(
    @Req()
    req: any,
  ) {
    return this.service.listUsers(
      req.user.id,
    );
  }

  @Post('admin/users')
  @UseGuards(
    AuthGuard(
      'portal-jwt',
    ),
    RolesGuard,
  )
  @Roles(
    'SUPER_ADMIN',
    'ADMIN',
  )
  createUser(
    @Req()
    req: any,

    @Body()
    body: any,
  ) {
    return this.service.createUser(
      req.user.id,
      body,
    );
  }

  @Post('admin/users/:id/reset-password')
  @UseGuards(
    AuthGuard(
      'portal-jwt',
    ),
    RolesGuard,
  )
  @Roles(
    'SUPER_ADMIN',
    'ADMIN',
  )
  resetPassword(
    @Param('id')
    id: string,
  ) {
    return this.service.resetPassword(
      id,
    );
  }

  @Patch('admin/users/:id/deactivate')
  @UseGuards(
    AuthGuard(
      'portal-jwt',
    ),
    RolesGuard,
  )
  @Roles(
    'SUPER_ADMIN',
    'ADMIN',
  )
  deactivate(
    @Param('id')
    id: string,
  ) {
    return this.service.deactivate(
      id,
    );
  }
}