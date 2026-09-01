import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import {
  JwtService,
} from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import {
  randomInt,
} from 'node:crypto';

import {
  PrismaService,
} from '../prisma/prisma.service.js';

@Injectable()
export class PublicSignupService {
  constructor(
    private readonly prisma:
      PrismaService,

    private readonly jwt:
      JwtService,
  ) {}

  private numeric12() {
    let value =
      String(
        randomInt(1, 10),
      );

    for (
      let i = 1;
      i < 12;
      i++
    ) {
      value +=
        String(
          randomInt(0, 10),
        );
    }

    return value;
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

  private async tenant() {
    const configured =
      process.env.DEFAULT_TENANT_ID;

    if (configured) {
      const tenant =
        await this.prisma.tenant.findUnique({
          where: {
            id:
              configured,
          },
        });

      if (tenant) {
        return tenant;
      }
    }

    const tenant =
      await this.prisma.tenant.findFirst({
        orderBy: {
          createdAt:
            'asc',
        },
      });

    if (!tenant) {
      throw new BadRequestException(
        'No Gogate Products tenant is configured.',
      );
    }

    return tenant;
  }

  async signup(body: any) {
    const accountType =
      String(
        body.accountType ??
        body.role ??
        '',
      )
        .trim()
        .toUpperCase();

    const allowed = [
      'CUSTOMER',
      'SHIPPER',
      'MERCHANT',
    ];

    if (
      !allowed.includes(
        accountType,
      )
    ) {
      throw new BadRequestException(
        'Choose Customer, Shipper or Merchant account.',
      );
    }

    const phone =
      String(
        body.phone ??
        '',
      ).trim();

    const email =
      String(
        body.email ??
        '',
      )
        .trim()
        .toLowerCase();

    const password =
      String(
        body.password ??
        '',
      );

    if (!phone) {
      throw new BadRequestException(
        'Mobile number is required.',
      );
    }

    if (
      !/^[0-9]{10,15}$/.test(
        phone,
      )
    ) {
      throw new BadRequestException(
        'Enter a valid mobile number.',
      );
    }

    if (
      password.length < 8
    ) {
      throw new BadRequestException(
        'Password must be at least 8 characters.',
      );
    }

    const existing =
      await this.prisma.user.findFirst({
        where: {
          OR: [
            {
              phone,
            },

            email
              ? {
                  email,
                }
              : undefined,
          ].filter(Boolean) as any,
        },
      });

    if (existing) {
      throw new BadRequestException(
        'An account with this mobile number or email already exists.',
      );
    }

    const tenant =
      await this.tenant();

    const userCode =
      await this.uniqueUserCode();

    const passwordHash =
      await bcrypt.hash(
        password,
        12,
      );

    const requiresKyc =
      accountType ===
        'SHIPPER' ||
      accountType ===
        'MERCHANT';

    const user =
      await this.prisma.user.create({
        data: {
          tenantId:
            tenant.id,

          userCode,

          role:
            accountType as any,

          phone,

          email:
            email || null,

          passwordHash,

          status:
            requiresKyc
              ? 'KYC_PENDING'
              : 'ACTIVE',

          mustChangePassword:
            false,
        },
      });

    const accessToken =
      await this.jwt.signAsync(
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

    let redirectTo =
      '/portal/customer';

    if (
      user.role ===
      'SHIPPER'
    ) {
      redirectTo =
        '/portal/shipper/kyc';
    }

    if (
      user.role ===
      'MERCHANT'
    ) {
      redirectTo =
        '/portal/merchant/kyc';
    }

    return {
      success: true,

      accessToken,

      redirectTo,

      user: {
        id:
          user.id,

        userId:
          user.userCode,

        role:
          user.role,

        phone:
          user.phone,

        email:
          user.email,

        status:
          user.status,
      },
    };
  }
}