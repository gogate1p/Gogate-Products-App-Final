import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service.js';
import {
  numericId12,
  temporaryPassword,
} from '../common/numeric-id.js';

@Injectable()
export class HubOpsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private async currentUser(userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('Login required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const allowed = [
      'SUPER_ADMIN',
      'ADMIN',
      'OPERATIONS_MANAGER',
      'HUB_MANAGER',
      'HUB_PERSONNEL',
      'DISPATCHER',
    ];

    if (!allowed.includes(user.role)) {
      throw new ForbiddenException('Hub access denied');
    }

    return user;
  }

  async ensureUserCode(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.userCode) {
      return user;
    }

    let code = numericId12();

    while (
      await this.prisma.user.findUnique({
        where: { userCode: code },
      })
    ) {
      code = numericId12();
    }

    return this.prisma.user.update({
      where: { id: user.id },
      data: { userCode: code },
    });
  }

  async ensureHubCode(hubId: string) {
    const hub = await this.prisma.hub.findUnique({
      where: { id: hubId },
    });

    if (!hub) {
      throw new NotFoundException('Hub not found');
    }

    if (hub.hubCode) {
      return hub;
    }

    let code = numericId12();

    while (
      await this.prisma.hub.findUnique({
        where: { hubCode: code },
      })
    ) {
      code = numericId12();
    }

    return this.prisma.hub.update({
      where: { id: hub.id },
      data: { hubCode: code },
    });
  }

  async hubs(userId?: string) {
    const user = await this.currentUser(userId);

    const hubs = await this.prisma.hub.findMany({
      where: {
        tenantId: user.tenantId,
      },
      orderBy: {
        name: 'asc',
      },
    });

    for (const hub of hubs) {
      if (!hub.hubCode) {
        await this.ensureHubCode(hub.id);
      }
    }

    return this.prisma.hub.findMany({
      where: {
        tenantId: user.tenantId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async me(
    userId?: string,
    hubId?: string,
  ) {
    const user = await this.currentUser(userId);

    const codedUser = await this.ensureUserCode(
      user.id,
    );

    let hub = null;

    if (hubId) {
      hub = await this.prisma.hub.findFirst({
        where: {
          id: hubId,
          tenantId: user.tenantId,
        },
      });

      if (hub && !hub.hubCode) {
        hub = await this.ensureHubCode(hub.id);
      }
    }

    return {
      user: {
        id: codedUser.id,
        userId: codedUser.userCode,
        phone: codedUser.phone,
        email: codedUser.email,
        role: codedUser.role,
        status: codedUser.status,
      },

      hub: hub
        ? {
            id: hub.id,
            hubId: hub.hubCode,
            name: hub.name,
            type: hub.type,
            locationLat: hub.locationLat,
            locationLng: hub.locationLng,
            pinCodesServed: hub.pinCodesServed,
          }
        : null,
    };
  }

  private async context(
    userId?: string,
    hubId?: string,
  ) {
    const user = await this.currentUser(userId);

    if (!hubId) {
      throw new BadRequestException(
        'X-Hub-Id header required',
      );
    }

    const hub = await this.prisma.hub.findFirst({
      where: {
        id: hubId,
        tenantId: user.tenantId,
      },
    });

    if (!hub) {
      throw new ForbiddenException(
        'Hub not available',
      );
    }

    return {
      user,
      hub,
    };
  }

  async dashboard(
    userId?: string,
    hubId?: string,
  ) {
    const { user, hub } =
      await this.context(userId, hubId);

    if (!hub.hubCode) {
      await this.ensureHubCode(hub.id);
    }

    const [
      inbound,
      outbound,
      atHub,
      openBags,
      activeManifests,
      scansToday,
      riderCount,
      pendingKyc,
    ] =
      await Promise.all([
        this.prisma.shipment.count({
          where: {
            tenantId: user.tenantId,
            destinationHubId: hub.id,
            status: {
              notIn: ['DELIVERED', 'RETURNED'],
            },
          },
        }),

        this.prisma.shipment.count({
          where: {
            tenantId: user.tenantId,
            originHubId: hub.id,
            status: {
              notIn: ['DELIVERED', 'RETURNED'],
            },
          },
        }),

        this.prisma.shipment.count({
          where: {
            tenantId: user.tenantId,
            currentHubId: hub.id,
          },
        }),

        this.prisma.bag.count({
          where: {
            tenantId: user.tenantId,
            originHubId: hub.id,
            status: 'OPEN',
          },
        }),

        this.prisma.manifest.count({
          where: {
            tenantId: user.tenantId,
            OR: [
              { originHubId: hub.id },
              { destinationHubId: hub.id },
            ],
            status: {
              notIn: ['CLOSED', 'CANCELLED'],
            },
          },
        }),

        this.prisma.packageScan.count({
          where: {
            tenantId: user.tenantId,
            hubId: hub.id,
            createdAt: {
              gte: new Date(
                new Date().setHours(0, 0, 0, 0),
              ),
            },
          },
        }),

        this.prisma.riderHubAssignment.count({
          where: {
            tenantId: user.tenantId,
            hubId: hub.id,
            assignmentStatus: 'ACTIVE',
          },
        }),

        this.prisma.riderKyc.count({
          where: {
            tenantId: user.tenantId,
            status: {
              in: [
                'SUBMITTED',
                'UNDER_REVIEW',
                'DOCUMENTS_PENDING',
              ],
            },
          },
        }),
      ]);

    const freshHub =
      await this.prisma.hub.findUnique({
        where: {
          id: hub.id,
        },
      });

    return {
      hub: {
        id: freshHub?.id,
        hubId: freshHub?.hubCode,
        name: freshHub?.name,
        type: freshHub?.type,

        location: {
          lat: freshHub?.locationLat,
          lng: freshHub?.locationLng,
        },

        pinCodesServed:
          freshHub?.pinCodesServed ?? [],
      },

      metrics: {
        inbound,
        outbound,
        atHub,
        openBags,
        activeManifests,
        scansToday,
        riderCount,
        pendingKyc,
      },
    };
  }

  async riders(
    userId?: string,
    hubId?: string,
  ) {
    const { user, hub } =
      await this.context(userId, hubId);

    return this.prisma.riderHubAssignment.findMany({
      where: {
        tenantId: user.tenantId,
        hubId: hub.id,
      },

      include: {
        riderProfile: {
          include: {
            user: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createRider(
    userId: string | undefined,
    hubId: string | undefined,
    body: any,
  ) {
    const { user, hub } =
      await this.context(userId, hubId);

    if (!body.phone) {
      throw new BadRequestException(
        'Phone number required',
      );
    }

    const exists =
      await this.prisma.user.findFirst({
        where: {
          OR: [
            {
              phone: String(body.phone),
            },

            body.email
              ? {
                  email: String(body.email),
                }
              : undefined,
          ].filter(Boolean) as any,
        },
      });

    if (exists) {
      throw new BadRequestException(
        'Phone or email already exists',
      );
    }

    let userCode =
      numericId12();

    while (
      await this.prisma.user.findUnique({
        where: {
          userCode,
        },
      })
    ) {
      userCode =
        numericId12();
    }

    let riderCode =
      numericId12();

    while (
      await this.prisma.riderProfile.findUnique({
        where: {
          riderCode,
        },
      })
    ) {
      riderCode =
        numericId12();
    }

    const password =
      temporaryPassword();

    const passwordHash =
      await bcrypt.hash(
        password,
        12,
      );

    const created =
      await this.prisma.$transaction(
        async tx => {
          const newUser =
            await tx.user.create({
              data: {
                tenantId:
                  user.tenantId,

                userCode,

                role:
                  'RIDER',

                phone:
                  String(body.phone),

                email:
                  body.email
                    ? String(body.email)
                    : null,

                passwordHash,

                status:
                  'ACTIVE',
              },
            });

          const profile =
            await tx.riderProfile.create({
              data: {
                tenantId:
                  user.tenantId,

                userId:
                  newUser.id,

                riderCode,

                riderState:
                  'APPLICANT',

                primaryHubId:
                  hub.id,

                preferredHubId:
                  hub.id,
              },
            });

          await tx.riderHubAssignment.create({
            data: {
              tenantId:
                user.tenantId,

              riderProfileId:
                profile.id,

              hubId:
                hub.id,

              assignmentStatus:
                'ACTIVE',

              isPrimary:
                true,

              effectiveFrom:
                new Date(),

              approvedById:
                user.id,

              approvedAt:
                new Date(),
            },
          });

          return {
            newUser,
            profile,
          };
        },
      );

    return {
      success: true,

      credentials: {
        userId:
          userCode,

        riderId:
          riderCode,

        password,
      },

      user: {
        id:
          created.newUser.id,

        phone:
          created.newUser.phone,

        email:
          created.newUser.email,
      },
    };
  }

  async updateLocation(
    userId: string | undefined,
    hubId: string | undefined,
    body: any,
  ) {
    const { hub } =
      await this.context(userId, hubId);

    const lat =
      Number(body.lat);

    const lng =
      Number(body.lng);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      throw new BadRequestException(
        'Valid latitude and longitude required',
      );
    }

    return this.prisma.hub.update({
      where: {
        id: hub.id,
      },

      data: {
        locationLat:
          lat,

        locationLng:
          lng,
      },
    });
  }

  async inbound(
    userId?: string,
    hubId?: string,
  ) {
    const { user, hub } =
      await this.context(userId, hubId);

    return this.prisma.shipment.findMany({
      where: {
        tenantId:
          user.tenantId,

        destinationHubId:
          hub.id,
      },

      include: {
        originHub: true,
        destinationHub: true,
        packages: true,
      },

      orderBy: {
        createdAt:
          'desc',
      },
    });
  }

  async outbound(
    userId?: string,
    hubId?: string,
  ) {
    const { user, hub } =
      await this.context(userId, hubId);

    return this.prisma.shipment.findMany({
      where: {
        tenantId:
          user.tenantId,

        originHubId:
          hub.id,
      },

      include: {
        originHub: true,
        destinationHub: true,
        packages: true,
      },

      orderBy: {
        createdAt:
          'desc',
      },
    });
  }

  async manifests(
    userId?: string,
    hubId?: string,
  ) {
    const { user, hub } =
      await this.context(userId, hubId);

    return this.prisma.manifest.findMany({
      where: {
        tenantId:
          user.tenantId,

        OR: [
          {
            originHubId:
              hub.id,
          },

          {
            destinationHubId:
              hub.id,
          },
        ],
      },

      include: {
        originHub: true,
        destinationHub: true,
        vehicle: true,
        items: true,
      },

      orderBy: {
        createdAt:
          'desc',
      },
    });
  }

  async bags(
    userId?: string,
    hubId?: string,
  ) {
    const { user, hub } =
      await this.context(userId, hubId);

    return this.prisma.bag.findMany({
      where: {
        tenantId:
          user.tenantId,

        OR: [
          {
            originHubId:
              hub.id,
          },

          {
            destinationHubId:
              hub.id,
          },
        ],
      },

      include: {
        originHub: true,
        destinationHub: true,
        items: true,
      },

      orderBy: {
        createdAt:
          'desc',
      },
    });
  }

  async capacity(
    userId?: string,
    hubId?: string,
  ) {
    const { user, hub } =
      await this.context(userId, hubId);

    return this.prisma.hubCapacity.findMany({
      where: {
        tenantId:
          user.tenantId,

        hubId:
          hub.id,
      },

      orderBy: {
        createdAt:
          'desc',
      },
    });
  }

  async exceptions(
    userId?: string,
    hubId?: string,
  ) {
    const { user } =
      await this.context(userId, hubId);

    return this.prisma.package.findMany({
      where: {
        tenantId:
          user.tenantId,

        status: {
          in: [
            'DAMAGED',
            'LOST',
            'EXCEPTION',
            'FAILED',
          ],
        },
      },

      include: {
        shipment: true,
      },

      orderBy: {
        updatedAt:
          'desc',
      },
    });
  }
}