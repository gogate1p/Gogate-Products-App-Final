import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  PrismaService,
} from '../prisma/prisma.service.js';

@Injectable()
export class TrackingService {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  private stage(status: string) {
    const value =
      String(status ?? '')
        .toUpperCase();

    if (
      [
        'DELIVERED',
      ].includes(value)
    ) {
      return 4;
    }

    if (
      [
        'OUT_FOR_DELIVERY',
        'ASSIGNED_TO_RIDER',
      ].includes(value)
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
      ].includes(value)
    ) {
      return 2;
    }

    if (
      [
        'PICKED_UP',
        'READY_FOR_PICKUP',
      ].includes(value)
    ) {
      return 1;
    }

    return 0;
  }

  private timeline(
    shipment: any,
  ) {
    const current =
      this.stage(
        shipment.status,
      );

    const steps = [
      {
        key:
          'CREATED',
        title:
          'Shipment Created',
        description:
          'Your shipment has been created.',
      },

      {
        key:
          'PICKED_UP',
        title:
          'Picked Up',
        description:
          'The package has been collected from the sender.',
      },

      {
        key:
          'SHIPPED',
        title:
          'Shipped',
        description:
          'The shipment is moving through the Gogate Products network.',
      },

      {
        key:
          'OUT_FOR_DELIVERY',
        title:
          'Out for Delivery',
        description:
          'The shipment is with the delivery executive.',
      },

      {
        key:
          'DELIVERED',
        title:
          'Delivered',
        description:
          'The shipment has been delivered.',
      },
    ];

    return steps.map(
      (
        step,
        index,
      ) => ({
        ...step,

        state:
          index < current
            ? 'COMPLETED'
            : index === current
              ? 'CURRENT'
              : 'UPCOMING',
      }),
    );
  }

  private maskedName(
    value?: string,
  ) {
    if (!value) {
      return null;
    }

    const words =
      value
        .trim()
        .split(/\s+/);

    return words
      .map(
        word =>
          word.length <= 1
            ? word
            : `${word[0]}${'*'.repeat(
                Math.min(
                  word.length - 1,
                  4,
                ),
              )}`,
      )
      .join(' ');
  }

  async publicTrack(
    awb: string,
  ) {
    const shipment =
      await this.prisma.shipment.findUnique({
        where: {
          awb,
        },

        include: {
          order: true,

          originHub: true,

          destinationHub: true,

          events: {
            orderBy: {
              timestamp:
                'asc',
            },
          },
        },
      });

    if (!shipment) {
      throw new NotFoundException(
        'Shipment not found.',
      );
    }

    const details: any =
      shipment.order
        ?.customerDetails ??
      {};

    const sender =
      details.sender ??
      {};

    const receiver =
      details.receiver ??
      {};

    const expected =
      shipment.expectedDeliveryAt ??
      new Date(
        shipment.createdAt.getTime() +
        (
          shipment.serviceType ===
          'HYPERLOCAL'
            ? 1
            : 4
        ) *
        24 *
        60 *
        60 *
        1000,
      );

    return {
      awb:
        shipment.awb,

      status:
        shipment.status,

      serviceType:
        shipment.serviceType,

      createdAt:
        shipment.createdAt,

      expectedDeliveryAt:
        expected,

      deliveredAt:
        shipment.deliveredAt,

      receivedBy:
        shipment.status ===
          'DELIVERED'
          ? shipment.receivedByName
          : null,

      sender: {
        name:
          sender.name ??
          'Sender',

        city:
          sender.city ??
          null,
      },

      recipient: {
        name:
          this.maskedName(
            receiver.name,
          ),

        city:
          receiver.city ??
          null,

        pinCode:
          receiver.pinCode
            ? `${String(
                receiver.pinCode,
              ).slice(0, 3)}***`
            : null,
      },

      origin:
        shipment.originHub
          ? {
              name:
                shipment.originHub.name,
            }
          : null,

      destination:
        shipment.destinationHub
          ? {
              name:
                shipment.destinationHub.name,
            }
          : null,

      timeline:
        this.timeline(
          shipment,
        ),

      updates:
        shipment.events.map(
          event => ({
            status:
              event.status,

            timestamp:
              event.timestamp,

            metadata:
              event.metadata,
          }),
        ),
    };
  }
}