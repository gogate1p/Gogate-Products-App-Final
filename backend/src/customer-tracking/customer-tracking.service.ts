import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  PrismaService,
} from '../prisma/prisma.service.js';

import {
  ShipmentWorkflowService,
} from '../shipment-workflow/shipment-workflow.service.js';

@Injectable()
export class CustomerTrackingService {
  constructor(
    private readonly prisma:
      PrismaService,

    private readonly workflow:
      ShipmentWorkflowService,
  ) {}

  private async shipment(
    userId: string | undefined,
    awb: string,
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

          packages: {
            include: {
              manifestItems: {
                include: {
                  manifest: true,
                },
              },
            },
          },

          events: {
            orderBy: {
              timestamp:
                'asc',
            },
          },

          payments: true,

          deliveryAttempts: true,

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
        'Shipment does not belong to this customer.',
      );
    }

    return shipment;
  }

  private stage(
    status: string,
  ) {
    const statusValue =
      String(
        status ?? '',
      ).toUpperCase();

    if (
      statusValue ===
      'DELIVERED'
    ) {
      return 4;
    }

    if (
      statusValue ===
      'OUT_FOR_DELIVERY'
    ) {
      return 3;
    }

    if (
      [
        'SHIPPED',
        'AT_HUB',
        'BAGGED',
        'MANIFESTED',
        'IN_TRANSIT',
        'RECEIVED',
      ].includes(
        statusValue,
      )
    ) {
      return 2;
    }

    if (
      statusValue ===
      'PICKED_UP'
    ) {
      return 1;
    }

    return 0;
  }

  private timeline(
    status: string,
  ) {
    const current =
      this.stage(
        status,
      );

    const titles = [
      'Shipment Created',
      'Picked Up',
      'Shipped',
      'Out for Delivery',
      'Delivered',
    ];

    return titles.map(
      (
        title,
        index,
      ) => ({
        title,

        state:
          index < current
            ? 'COMPLETED'
            : index === current
              ? 'CURRENT'
              : 'UPCOMING',
      }),
    );
  }

  async details(
    userId:
      string | undefined,

    awb:
      string,
  ) {
    const shipment =
      await this.shipment(
        userId,
        awb,
      );

    const customerDetails: any =
      shipment.order
        .customerDetails ??
      {};

    const pickupOtp =
      shipment.status ===
      'OUT_FOR_PICKUP'
        ? await this.workflow.activeOtp(
            shipment.id,
            'PICKUP',
          )
        : null;

    /*
     * Sender does NOT receive delivery OTP here.
     * Delivery OTP belongs to the receiver.
     */
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

    const paymentMethod =
      String(
        customerDetails
          .paymentMethod ??
        'PREPAID',
      ).toUpperCase();

    return {
      shipment,

      timeline:
        this.timeline(
          shipment.status,
        ),

      sender:
        customerDetails.sender ??
        null,

      receiver:
        customerDetails.receiver ??
        null,

      pickupOtp,

      payment: {
        method:
          paymentMethod,

        amount:
          shipment.order
            .totalAmount,

        amountToCollect:
          paymentMethod ===
          'COD'
            ? shipment.order
                .totalAmount
            : 0,

        status:
          shipment.order
            .paymentStatus,
      },

      manifests,

      expectedDeliveryAt:
        shipment.expectedDeliveryAt ??
        new Date(
          shipment.createdAt.getTime() +
          (
            shipment.serviceType ===
            'HYPERLOCAL'
              ? 1
              : 4
          ) *
          86400000,
        ),
    };
  }
}