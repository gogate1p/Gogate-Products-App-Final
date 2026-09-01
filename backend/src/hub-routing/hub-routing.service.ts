import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  PrismaService,
} from '../prisma/prisma.service.js';

@Injectable()
export class HubRoutingService {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  private compactHubCode(
    hub: any,
  ) {
    if (!hub) {
      return null;
    }

    if (hub.shortCode) {
      return String(
        hub.shortCode,
      )
        .trim()
        .toUpperCase();
    }

    return String(
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
      .toUpperCase();
  }

  async instruction(
    awb: string,
  ) {
    const shipment =
      await this.prisma.shipment.findUnique({
        where: {
          awb,
        },

        include: {
          currentHub: true,
          destinationHub: true,
          originHub: true,
          order: true,
          packages: true,
        },
      });

    if (!shipment) {
      throw new NotFoundException(
        'Shipment not found.',
      );
    }

    const existing =
      await this.prisma.shipmentRoutingPlan.findUnique({
        where: {
          shipmentId:
            shipment.id,
        },
      });

    if (existing) {
      return {
        shipment,
        routing:
          existing,
      };
    }

    const currentHub =
      shipment.currentHub ??
      shipment.originHub;

    const nextHub =
      shipment.destinationHub;

    const currentHubCode =
      this.compactHubCode(
        currentHub,
      );

    const nextHubCode =
      this.compactHubCode(
        nextHub,
      );

    let staging =
      null;

    if (
      currentHub?.id &&
      nextHubCode
    ) {
      staging =
        await this.prisma.hubStagingLocation.findFirst({
          where: {
            tenantId:
              shipment.tenantId,

            hubId:
              currentHub.id,

            status:
              'ACTIVE',

            OR: [
              {
                nextHubCode,
              },
              {
                routeCode:
                  `${currentHubCode}-${nextHubCode}`,
              },
            ],
          },

          orderBy: {
            occupied:
              'asc',
          },
        });
    }

    let schedule =
      null;

    if (
      currentHub?.id &&
      nextHub?.id
    ) {
      schedule =
        await this.prisma.hubLinehaulSchedule.findFirst({
          where: {
            tenantId:
              shipment.tenantId,

            originHubId:
              currentHub.id,

            destinationHubId:
              nextHub.id,

            plannedDepartureAt: {
              gt:
                new Date(),
            },

            status: {
              in: [
                'SCHEDULED',
                'BOARDING',
              ],
            },
          },

          orderBy: {
            plannedDepartureAt:
              'asc',
          },
        });
    }

    const instruction =
      nextHubCode
        ? (
            staging
              ? `Keep shipment in ${staging.zoneCode} / ${staging.laneCode}${staging.rackCode ? ` / ${staging.rackCode}` : ''}. Next movement: ${nextHubCode}.`
              : `Stage shipment for next hub ${nextHubCode}.`
          )
        : 'Await route assignment.';

    const routing =
      await this.prisma.shipmentRoutingPlan.create({
        data: {
          tenantId:
            shipment.tenantId,

          shipmentId:
            shipment.id,

          currentHubId:
            currentHub?.id ??
            null,

          nextHubId:
            nextHub?.id ??
            null,

          currentHubCode,
          nextHubCode,

          stagingZone:
            staging?.zoneCode ??
            null,

          stagingLane:
            staging?.laneCode ??
            null,

          stagingRack:
            staging?.rackCode ??
            null,

          plannedVehicleId:
            schedule?.vehicleId ??
            null,

          plannedTripCode:
            schedule?.tripCode ??
            null,

          truckExpectedAt:
            schedule?.plannedArrivalAt ??
            null,

          plannedDispatchAt:
            schedule?.plannedDepartureAt ??
            null,

          estimatedHubArrival:
            schedule?.plannedArrivalAt ??
            null,

          instruction,
        },
      });

    return {
      shipment,
      routing,
    };
  }

  async hubQueue(
    hubId: string,
  ) {
    return this.prisma.shipmentRoutingPlan.findMany({
      where: {
        currentHubId:
          hubId,

        status: {
          in: [
            'PLANNED',
            'STAGED',
            'READY',
          ],
        },
      },

      orderBy: [
        {
          plannedDispatchAt:
            'asc',
        },

        {
          priority:
            'desc',
        },
      ],
    });
  }

  async refresh(
    awb: string,
  ) {
    const shipment =
      await this.prisma.shipment.findUnique({
        where: {
          awb,
        },
      });

    if (!shipment) {
      throw new NotFoundException(
        'Shipment not found.',
      );
    }

    await this.prisma.shipmentRoutingPlan.deleteMany({
      where: {
        shipmentId:
          shipment.id,
      },
    });

    return this.instruction(
      awb,
    );
  }
}