import {
  Injectable,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';

import {
  PrismaService
} from '../prisma/prisma.service.js';

@Injectable()
export class TruckDriverService {

  constructor(
    private readonly prisma:
      PrismaService
  ) {}

  private async driver(
    userId: string
  ) {

    const user =
      await this.prisma.user.findUnique({
        where: {
          id:
            userId
        }
      });

    if (!user) {
      throw new NotFoundException(
        'Driver not found'
      );
    }

    if (
      user.role !==
      'DRIVER'
    ) {
      throw new ForbiddenException(
        'Truck Driver access required'
      );
    }

    return user;
  }

  async me(
    userId: string
  ) {

    await this.driver(
      userId
    );

    return this.prisma.user.findUnique({
      where: {
        id:
          userId
      },

      select: {
        id: true,
        phone: true,
        email: true,
        role: true,
        status: true,
        tenantId: true,

        assignedVehicles: {
          select: {
            id: true,
            registration: true,
            type: true,
            vehicleType: true,
            make: true,
            model: true,
            capacity: true,
            status: true
          }
        }
      }
    });
  }

  async vehicle(
    userId: string
  ) {

    await this.driver(
      userId
    );

    return this.prisma.vehicle.findFirst({
      where: {
        assignedDriverId:
          userId
      }
    });
  }

  async manifests(
    userId: string
  ) {

    await this.driver(
      userId
    );

    return this.prisma.manifest.findMany({
      where: {
        driverId:
          userId
      },

      include: {
        originHub: true,
        destinationHub: true,
        vehicle: true,
        items: {
          include: {
            package: true,
            bag: true
          }
        }
      },

      orderBy: {
        createdAt:
          'desc'
      }
    });
  }

  async manifest(
    userId: string,
    id: string
  ) {

    await this.driver(
      userId
    );

    const manifest =
      await this.prisma.manifest.findFirst({
        where: {
          id,
          driverId:
            userId
        },

        include: {
          originHub: true,
          destinationHub: true,
          vehicle: true,

          items: {
            include: {
              package: true,
              bag: true
            }
          }
        }
      });

    if (!manifest) {
      throw new NotFoundException(
        'Manifest not found'
      );
    }

    return manifest;
  }

  async dashboard(
    userId: string
  ) {

    await this.driver(
      userId
    );

    const [
      assigned,
      inTransit,
      completed
    ] =
      await Promise.all([

        this.prisma.manifest.count({
          where: {
            driverId:
              userId,

            status: {
              in: [
                'DRAFT',
                'OPEN',
                'SEALED',
                'DISPATCHED'
              ]
            }
          }
        }),

        this.prisma.manifest.count({
          where: {
            driverId:
              userId,

            status:
              'IN_TRANSIT'
          }
        }),

        this.prisma.manifest.count({
          where: {
            driverId:
              userId,

            status: {
              in: [
                'RECEIVED',
                'RECONCILED',
                'CLOSED'
              ]
            }
          }
        })
      ]);

    const activeManifest =
      await this.prisma.manifest.findFirst({
        where: {
          driverId:
            userId,

          status:
            'IN_TRANSIT'
        },

        include: {
          originHub: true,
          destinationHub: true,
          vehicle: true
        }
      });

    return {
      assigned,
      inTransit,
      completed,
      activeManifest
    };
  }

  async startManifest(
    userId: string,
    id: string
  ) {

    await this.manifest(
      userId,
      id
    );

    return this.prisma.manifest.update({
      where: {
        id
      },

      data: {
        status:
          'IN_TRANSIT'
      }
    });
  }

  async arriveManifest(
    userId: string,
    id: string
  ) {

    await this.manifest(
      userId,
      id
    );

    return this.prisma.manifest.update({
      where: {
        id
      },

      data: {
        status:
          'ARRIVED'
      }
    });
  }

  async completeManifest(
    userId: string,
    id: string
  ) {

    await this.manifest(
      userId,
      id
    );

    return this.prisma.manifest.update({
      where: {
        id
      },

      data: {
        status:
          'RECEIVED'
      }
    });
  }

  async location(
    userId: string,
    body: any
  ) {

    const user =
      await this.driver(
        userId
      );

    return this.prisma.auditLog.create({
      data: {
        tenantId:
          user.tenantId,

        userId:
          user.id,

        action:
          'TRUCK_DRIVER_LOCATION',

        entity:
          'DRIVER',

        entityId:
          user.id,

        newValue: {
          lat:
            body.lat,

          lng:
            body.lng,

          accuracy:
            body.accuracy,

          manifestId:
            body.manifestId
        }
      }
    });
  }

  async scan(
    userId: string,
    body: any
  ) {

    const user =
      await this.driver(
        userId
      );

    return {
      accepted: true,
      actorId:
        user.id,
      scanValue:
        body.scanValue,
      scanType:
        body.scanType ??
        'TRUCK_DRIVER_SCAN',
      timestamp:
        new Date()
    };
  }
}