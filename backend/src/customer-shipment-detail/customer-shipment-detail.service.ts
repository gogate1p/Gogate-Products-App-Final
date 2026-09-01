import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  createHash,
  randomInt,
} from 'node:crypto';

import {
  PrismaService,
} from '../prisma/prisma.service.js';

@Injectable()
export class CustomerShipmentDetailService {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  private async user(
    userId?: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException();
    }

    const user =
      await this.prisma.user.findUnique({
        where: {
          id:
            userId,
        },
      });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private async shipment(
    userId: string | undefined,
    awb: string,
  ) {
    const user =
      await this.user(userId);

    const shipment =
      await this.prisma.shipment.findUnique({
        where: {
          awb,
        },

        include: {
          order: true,

          originHub: true,

          destinationHub: true,

          currentHub: true,

          events: {
            orderBy: {
              timestamp:
                'asc',
            },
          },

          packages: {
            include: {
              manifestItems: {
                include: {
                  manifest: true,
                },
              },
            },
          },

          payments: true,

          deliveryAttempts: true,

          routeStops: true,

          runsheetShipment: {
            include: {
              runsheet: true,
            },
          },
        },
      });

    if (!shipment) {
      throw new NotFoundException(
        'Shipment not found.',
      );
    }

    if (
      shipment.tenantId !==
      user.tenantId
    ) {
      throw new ForbiddenException();
    }

    if (
      user.role ===
      'CUSTOMER' &&
      shipment.order.merchantId !==
      user.id
    ) {
      throw new ForbiddenException(
        'This shipment does not belong to your account.',
      );
    }

    return {
      user,
      shipment,
    };
  }

  async detail(
    userId: string | undefined,
    awb: string,
  ) {
    const {
      shipment,
    } =
      await this.shipment(
        userId,
        awb,
      );

    const manifests =
      shipment.packages
        .flatMap(
          pkg =>
            pkg.manifestItems,
        )
        .map(
          item =>
            item.manifest,
        )
        .filter(Boolean);

    return {
      ...shipment,

      manifests,

      invoice: {
        orderId:
          shipment.order.id,

        amount:
          shipment.order.totalAmount,

        paymentStatus:
          shipment.order.paymentStatus,

        createdAt:
          shipment.order.createdAt,
      },
    };
  }

  async issueOtp(
    userId: string | undefined,
    awb: string,
    type: string,
  ) {
    const {
      user,
      shipment,
    } =
      await this.shipment(
        userId,
        awb,
      );

    const otpType =
      String(type)
        .toUpperCase();

    if (
      ![
        'PICKUP',
        'DELIVERY',
      ].includes(
        otpType,
      )
    ) {
      throw new NotFoundException(
        'Invalid OTP type.',
      );
    }

    const code =
      String(
        randomInt(
          100000,
          1000000,
        ),
      );

    const otpHash =
      createHash(
        'sha256',
      )
        .update(code)
        .digest('hex');

    await this.prisma.shipmentOtp.updateMany({
      where: {
        shipmentId:
          shipment.id,

        type:
          otpType,

        status:
          'ACTIVE',
      },

      data: {
        status:
          'REVOKED',
      },
    });

    await this.prisma.shipmentOtp.create({
      data: {
        shipmentId:
          shipment.id,

        userId:
          user.id,

        type:
          otpType,

        otpHash,

        expiresAt:
          new Date(
            Date.now() +
            15 *
            60 *
            1000,
          ),
      },
    });

    /*
     * OTP is returned only to the authenticated
     * customer and only when generated.
     * The database stores only its hash.
     */
    return {
      type:
        otpType,

      otp:
        code,

      expiresInMinutes:
        15,
    };
  }
}