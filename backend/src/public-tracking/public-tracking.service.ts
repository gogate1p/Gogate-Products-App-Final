import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  PrismaService,
} from '../prisma/prisma.service.js';

@Injectable()
export class PublicTrackingService {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  private stage(
    status: string,
  ) {
    const value =
      String(
        status ?? '',
      ).toUpperCase();

    if (
      value ===
      'DELIVERED'
    ) {
      return 4;
    }

    if (
      value ===
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
        value,
      )
    ) {
      return 2;
    }

    if (
      value ===
      'PICKED_UP'
    ) {
      return 1;
    }

    return 0;
  }

  private hubCode(
    hub: any,
  ) {
    if (!hub) {
      return null;
    }

    return (
      hub.shortCode ??
      String(
        hub.code ??
        hub.name ??
        '',
      )
        .replace(
          /[^A-Za-z0-9]/g,
          '',
        )
        .slice(
          0,
          4,
        )
        .toUpperCase()
    );
  }

  async track(
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
          currentHub: true,
          destinationHub: true,

          events: {
            orderBy: {
              timestamp:
                'desc',
            },

            take:
              50,
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
        .customerDetails ??
      {};

    const sender =
      details.sender ??
      {};

    const receiver =
      details.receiver ??
      {};

    const current =
      this.stage(
        shipment.status,
      );

    const titles = [
      'Shipment Created',
      'Picked Up',
      'Shipped',
      'Out for Delivery',
      'Delivered',
    ];

    /*
     * Normal courier:
     * expectedDeliveryDate only.
     *
     * Hyperlocal:
     * live ETA is displayed only if ops/app data has
     * actually written etaMinutes into event metadata.
     */
    let liveEtaMinutes:
      number |
      null =
      null;

    if (
      shipment.serviceType ===
      'HYPERLOCAL'
    ) {
      const etaEvent =
        shipment.events.find(
          (event: any) =>
            event.metadata &&
            typeof (
              event.metadata as any
            ).etaMinutes ===
              'number',
        );

      liveEtaMinutes =
        etaEvent
          ? Number(
              (
                etaEvent.metadata as any
              ).etaMinutes,
            )
          : null;
    }

    const expectedDeliveryAt =
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

      expectedDeliveryAt,

      liveEtaMinutes:
        shipment.serviceType ===
        'HYPERLOCAL'
          ? liveEtaMinutes
          : null,

      deliveredAt:
        shipment.deliveredAt,

      receivedBy:
        shipment.status ===
        'DELIVERED'
          ? shipment.receivedByName
          : null,

      sender: {
        name:
          sender.businessName ??
          sender.name ??
          'Sender',

        city:
          sender.city ??
          null,
      },

      receiver: {
        name:
          receiver.name ??
          null,

        city:
          receiver.city ??
          null,
      },

      network: {
        originHubCode:
          this.hubCode(
            shipment.originHub,
          ),

        currentHubCode:
          this.hubCode(
            shipment.currentHub,
          ),

        destinationHubCode:
          this.hubCode(
            shipment.destinationHub,
          ),
      },

      timeline:
        titles.map(
          (
            title,
            index,
          ) => ({
            title,

            state:
              index < current
                ? 'COMPLETED'
                : index ===
                  current
                  ? 'CURRENT'
                  : 'UPCOMING',
          }),
        ),

      updates:
        shipment.events.map(
          (
            event: any,
          ) => ({
            status:
              event.status,

            timestamp:
              event.timestamp,

            location:
              event.metadata
                ? (
                    event.metadata as any
                  ).locationName ??
                  null
                : null,

            hubCode:
              event.metadata
                ? (
                    event.metadata as any
                  ).hubCode ??
                  null
                : null,

            message:
              event.metadata
                ? (
                    event.metadata as any
                  ).customerMessage ??
                  null
                : null,
          }),
        ),
    };
  }
}