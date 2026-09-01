import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  JwtService,
} from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import {
  createHash,
  randomBytes,
  randomInt,
} from 'node:crypto';

import {
  PrismaService,
} from '../prisma/prisma.service.js';

@Injectable()
export class PortalAuthService {
  constructor(
    private readonly prisma:
      PrismaService,

    private readonly jwt:
      JwtService,
  ) {}

  private numeric12() {
    let result =
      String(
        randomInt(
          1,
          10,
        ),
      );

    for (
      let i = 1;
      i < 12;
      i++
    ) {
      result +=
        String(
          randomInt(
            0,
            10,
          ),
        );
    }

    return result;
  }

  private async uniqueUserCode() {
    let code =
      this.numeric12();

    while (
      await this.prisma.user.findUnique({
        where: {
          userCode:
            code,
        },
      })
    ) {
      code =
        this.numeric12();
    }

    return code;
  }

  private temporaryPassword() {
    return `Gp@${this.numeric12().slice(0, 8)}`;
  }

  private hash(
    value: string,
  ) {
    return createHash(
      'sha256',
    )
      .update(value)
      .digest('hex');
  }

  private portalFor(
    role: string,
    status: string,
  ) {
    if (
      role === 'MERCHANT'
    ) {
      return status ===
        'ACTIVE'
        ? '/portal/merchant'
        : '/portal/merchant/kyc';
    }

    if (
      role === 'SHIPPER'
    ) {
      return status ===
        'ACTIVE'
        ? '/portal/shipper'
        : '/portal/shipper/kyc';
    }

    const routes:
      Record<
        string,
        string
      > = {
        SUPER_ADMIN:
          '/portal/admin',

        ADMIN:
          '/portal/admin',

        OPERATIONS_MANAGER:
          '/portal/dispatcher',

        REGIONAL_MANAGER:
          '/portal/branch',

        HUB_MANAGER:
          '/portal/hub',

        HUB_PERSONNEL:
          '/portal/hub',

        DISPATCHER:
          '/portal/dispatcher',

        BRANCH_MANAGER:
          '/portal/branch',

        BRANCH_STAFF:
          '/portal/branch',

        BOOKING_AGENT:
          '/portal/branch',

        FLEET_MANAGER:
          '/portal/dispatcher',

        FINANCE:
          '/portal/staff',

        SUPPORT:
          '/portal/support',

        CUSTOMER:
          '/portal/customer',
      };

    return (
      routes[role] ??
      '/'
    );
  }

  private async ensureUserCode(
    user: any,
  ) {
    if (
      user.userCode
    ) {
      return user;
    }

    return this.prisma.user.update({
      where: {
        id:
          user.id,
      },

      data: {
        userCode:
          await this.uniqueUserCode(),
      },
    });
  }

  private async signAccessToken(
    user: any,
  ) {
    return this.jwt.signAsync(
      {
        sub:
          user.id,

        tenantId:
          user.tenantId,

        role:
          user.role,

        userCode:
          user.userCode,

        type:
          'access',
      },

      {
        expiresIn:
          '30m',
      },
    );
  }

  private async createRefreshSession(
    user: any,
    metadata: any,
  ) {
    const raw =
      randomBytes(
        48,
      ).toString(
        'hex',
      );

    const hash =
      this.hash(raw);

    const expiresAt =
      new Date(
        Date.now() +
        30 *
          24 *
          60 *
          60 *
          1000,
      );

    const session =
      await this.prisma.authSession.create({
        data: {
          userId:
            user.id,

          refreshTokenHash:
            hash,

          expiresAt,

          userAgent:
            metadata?.userAgent ??
            null,

          ipAddress:
            metadata?.ipAddress ??
            null,
        },
      });

    const token =
      `${session.id}.${raw}`;

    return {
      token,
      expiresAt,
    };
  }


  async login(
    body: any,
    metadata?: any,
  ) {
    const loginId =
      String(
        body.loginId ??
          body.userId ??
          body.phone ??
          body.email ??
          '',
      ).trim();

    const password =
      String(
        body.password ??
          '',
      );

    if (
      !loginId ||
      !password
    ) {
      throw new BadRequestException(
        'User ID, phone or email and password are required.',
      );
    }

    const foundUser =
      await this.prisma.user.findFirst({
        where: {
          OR: [
            {
              userCode:
                loginId,
            },

            {
              phone:
                loginId,
            },

            {
              email:
                loginId,
            },
          ],
        },
      });

    if (!foundUser) {
      throw new UnauthorizedException(
        'Invalid credentials.',
      );
    }

    if (
      foundUser.status ===
        'SUSPENDED' ||
      foundUser.status ===
        'INACTIVE' ||
      foundUser.status ===
        'DEACTIVATED'
    ) {
      throw new ForbiddenException(
        'This account is not active.',
      );
    }

    const valid =
      await bcrypt.compare(
        password,
        foundUser.passwordHash,
      );

    if (!valid) {
      throw new UnauthorizedException(
        'Invalid credentials.',
      );
    }

    const user =
      await this.ensureUserCode(
        foundUser,
      );

    await this.prisma.user.update({
      where: {
        id:
          user.id,
      },

      data: {
        lastLoginAt:
          new Date(),
      },
    });

    const accessToken =
      await this.signAccessToken(
        user,
      );

    const refresh =
      await this.createRefreshSession(
        user,
        metadata,
      );

    return {
      accessToken,

      refreshToken:
        refresh.token,

      refreshTokenExpiresAt:
        refresh.expiresAt,

      mustChangePassword:
        user.mustChangePassword,

      redirectTo:
        user.mustChangePassword
          ? '/portal/change-password'
          : this.portalFor(
              user.role,
              user.status,
            ),

      user: {
        id:
          user.id,

        userId:
          user.userCode,

        role:
          user.role,

        email:
          user.email,

        phone:
          user.phone,

        status:
          user.status,

        mustChangePassword:
          user.mustChangePassword,
      },
    };
  }
  async refresh(
    refreshToken:
      string,
  ) {
    const [
      sessionId,
      raw,
    ] =
      String(
        refreshToken ??
        '',
      ).split('.');

    if (
      !sessionId ||
      !raw
    ) {
      throw new UnauthorizedException(
        'Invalid refresh token.',
      );
    }

    const session =
      await this.prisma.authSession.findUnique({
        where: {
          id:
            sessionId,
        },
      });

    if (
      !session ||
      session.revokedAt ||
      session.expiresAt <
        new Date()
    ) {
      throw new UnauthorizedException(
        'Refresh session expired.',
      );
    }

    if (
      session.refreshTokenHash !==
      this.hash(raw)
    ) {
      throw new UnauthorizedException(
        'Invalid refresh token.',
      );
    }

    const user =
      await this.prisma.user.findUnique({
        where: {
          id:
            session.userId,
        },
      });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      accessToken:
        await this.signAccessToken(
          user,
        ),
    };
  }

  async me(
    userId: string,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id:
            userId,
        },

        select: {
          id: true,
          userCode: true,
          tenantId: true,
          role: true,
          email: true,
          phone: true,
          status: true,
          mustChangePassword: true,
          lastLoginAt: true,
        },
      });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      ...user,

      userId:
        user.userCode,

      redirectTo:
        user.mustChangePassword
          ? '/portal/change-password'
          : this.portalFor(
              user.role,
              user.status,
            ),
    };
  }


  async changePassword(
    userId: string,
    body: any,
  ) {
    if (
      !body.currentPassword ||
      !body.newPassword
    ) {
      throw new BadRequestException(
        'Current and new password are required.',
      );
    }

    if (
      String(
        body.newPassword,
      ).length < 8
    ) {
      throw new BadRequestException(
        'New password must be at least 8 characters.',
      );
    }

    const user =
      await this.prisma.user.findUnique({
        where: {
          id:
            userId,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found.',
      );
    }

    const valid =
      await bcrypt.compare(
        body.currentPassword,
        user.passwordHash,
      );

    if (!valid) {
      throw new UnauthorizedException(
        'Current password is incorrect.',
      );
    }

    const passwordHash =
      await bcrypt.hash(
        body.newPassword,
        12,
      );

    await this.prisma.user.update({
      where: {
        id:
          user.id,
      },

      data: {
        passwordHash,

        mustChangePassword:
          false,
      },
    });

    return {
      success:
        true,

      redirectTo:
        this.portalFor(
          user.role,
          user.status,
        ),
    };
  }
  async logout(
    refreshToken:
      string,
  ) {
    const [
      sessionId,
    ] =
      String(
        refreshToken ??
        '',
      ).split('.');

    if (sessionId) {
      await this.prisma.authSession.updateMany({
        where: {
          id:
            sessionId,

          revokedAt:
            null,
        },

        data: {
          revokedAt:
            new Date(),
        },
      });
    }

    return {
      success: true,
    };
  }

  async listUsers(
    requesterId:
      string,
  ) {
    const requester =
      await this.prisma.user.findUnique({
        where: {
          id:
            requesterId,
        },
      });

    if (!requester) {
      throw new UnauthorizedException();
    }

    return this.prisma.user.findMany({
      where: {
        tenantId:
          requester.tenantId,
      },

      select: {
        id: true,
        userCode: true,
        role: true,
        phone: true,
        email: true,
        status: true,
        mustChangePassword: true,
        createdAt: true,
        lastLoginAt: true,
      },

      orderBy: {
        createdAt:
          'desc',
      },
    });
  }

  async createUser(
    requesterId:
      string,

    body:
      any,
  ) {
    const requester =
      await this.prisma.user.findUnique({
        where: {
          id:
            requesterId,
        },
      });

    if (!requester) {
      throw new UnauthorizedException();
    }

    if (!body.phone) {
      throw new BadRequestException(
        'Phone number is required.',
      );
    }

    if (!body.role) {
      throw new BadRequestException(
        'Role is required.',
      );
    }

    const existing =
      await this.prisma.user.findFirst({
        where: {
          OR: [
            {
              phone:
                String(body.phone),
            },

            body.email
              ? {
                  email:
                    String(
                      body.email,
                    ),
                }
              : undefined,
          ].filter(Boolean) as any,
        },
      });

    if (existing) {
      throw new BadRequestException(
        'Phone or email is already registered.',
      );
    }

    const userCode =
      await this.uniqueUserCode();

    const temporaryPassword =
      this.temporaryPassword();

    const passwordHash =
      await bcrypt.hash(
        temporaryPassword,
        12,
      );

    const kycRoles = [
      'MERCHANT',
      'SHIPPER',
    ];

    const user =
      await this.prisma.user.create({
        data: {
          tenantId:
            requester.tenantId,

          userCode,

          role:
            body.role,

          phone:
            String(
              body.phone,
            ),

          email:
            body.email
              ? String(
                  body.email,
                )
              : null,

          passwordHash,

          status:
            kycRoles.includes(
              body.role,
            )
              ? 'KYC_PENDING'
              : 'ACTIVE',

          mustChangePassword:
            true,
        },
      });

    return {
      success: true,

      credentials: {
        userId:
          userCode,

        temporaryPassword,
      },

      user: {
        id:
          user.id,

        userId:
          user.userCode,

        role:
          user.role,

        status:
          user.status,

        phone:
          user.phone,

        email:
          user.email,
      },
    };
  }

  async resetPassword(
    targetUserId:
      string,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id:
            targetUserId,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found.',
      );
    }

    const password =
      this.temporaryPassword();

    await this.prisma.user.update({
      where: {
        id:
          user.id,
      },

      data: {
        passwordHash:
          await bcrypt.hash(
            password,
            12,
          ),

        mustChangePassword:
          true,
      },
    });

    await this.prisma.authSession.updateMany({
      where: {
        userId:
          user.id,

        revokedAt:
          null,
      },

      data: {
        revokedAt:
          new Date(),
      },
    });

    return {
      success: true,

      temporaryPassword:
        password,
    };
  }

  async deactivate(
    targetUserId:
      string,
  ) {
    await this.prisma.user.update({
      where: {
        id:
          targetUserId,
      },

      data: {
        status:
          'INACTIVE',
      },
    });

    await this.prisma.authSession.updateMany({
      where: {
        userId:
          targetUserId,

        revokedAt:
          null,
      },

      data: {
        revokedAt:
          new Date(),
      },
    });

    return {
      success: true,
    };
  }
}