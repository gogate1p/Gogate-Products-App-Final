import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service.js';

import {
  generatedPassword,
  numeric12,
} from './branch-numbers.js';

@Injectable()
export class BranchOpsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private async uniqueUserCode() {
    let value = numeric12();

    while (
      await this.prisma.user.findUnique({
        where: {
          userCode: value,
        },
      })
    ) {
      value = numeric12();
    }

    return value;
  }

  private async uniqueBranchCode() {
    let value = numeric12();

    while (
      await this.prisma.courierBranch.findUnique({
        where: {
          branchCode: value,
        },
      })
    ) {
      value = numeric12();
    }

    return value;
  }

  private async uniquePickupCode() {
    let value = numeric12();

    while (
      await this.prisma.pickupRequest.findUnique({
        where: {
          pickupCode: value,
        },
      })
    ) {
      value = numeric12();
    }

    return value;
  }

  private async uniqueAwb() {
    let value = numeric12();

    while (
      await this.prisma.shipment.findUnique({
        where: {
          awb: value,
        },
      })
    ) {
      value = numeric12();
    }

    return value;
  }

  async login(body: any) {
    const login =
      String(
        body.loginId ??
        body.userId ??
        body.phone ??
        '',
      ).trim();

    if (!login || !body.password) {
      throw new BadRequestException(
        'User ID/mobile and password required',
      );
    }

    const user =
      await this.prisma.user.findFirst({
        where: {
          OR: [
            {
              userCode: login,
            },
            {
              phone: login,
            },
            {
              email: login,
            },
          ],
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const valid =
      await bcrypt.compare(
        body.password,
        user.passwordHash,
      );

    if (!valid) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const roles = [
      'SUPER_ADMIN',
      'ADMIN',
      'OPERATIONS_MANAGER',
      'REGIONAL_MANAGER',
      'BRANCH_MANAGER',
      'BRANCH_STAFF',
      'BOOKING_AGENT',
    ];

    if (!roles.includes(user.role)) {
      throw new ForbiddenException(
        'Courier Branch access not enabled',
      );
    }

    const token =
      await this.jwt.signAsync({
        sub: user.id,
        userId: user.id,
        tenantId: user.tenantId,
        role: user.role,
      });

    return {
      accessToken: token,

      user: {
        id: user.id,
        userId: user.userCode,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    };
  }

  private async user(userId?: string) {
    if (!userId) {
      throw new UnauthorizedException();
    }

    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private isGlobal(role: string) {
    return [
      'SUPER_ADMIN',
      'ADMIN',
      'OPERATIONS_MANAGER',
    ].includes(role);
  }

  async me(userId?: string) {
    const user =
      await this.user(userId);

    const assignments =
      await this.prisma.branchUserAssignment.findMany({
        where: {
          tenantId: user.tenantId,
          userId: user.id,
          status: 'ACTIVE',
        },
      });

    const branchIds =
      assignments.map(
        x => x.branchId,
      );

    const branches =
      branchIds.length
        ? await this.prisma.courierBranch.findMany({
            where: {
              id: {
                in: branchIds,
              },
            },
          })
        : [];

    return {
      user: {
        id: user.id,
        userId: user.userCode,
        phone: user.phone,
        email: user.email,
        role: user.role,
        status: user.status,
      },

      branches,
    };
  }

  async branches(userId?: string) {
    const user =
      await this.user(userId);

    if (this.isGlobal(user.role)) {
      return this.prisma.courierBranch.findMany({
        where: {
          tenantId: user.tenantId,
        },

        orderBy: {
          name: 'asc',
        },
      });
    }

    const assignments =
      await this.prisma.branchUserAssignment.findMany({
        where: {
          tenantId: user.tenantId,
          userId: user.id,
          status: 'ACTIVE',
        },
      });

    return this.prisma.courierBranch.findMany({
      where: {
        tenantId: user.tenantId,

        id: {
          in: assignments.map(
            x => x.branchId,
          ),
        },
      },

      orderBy: {
        name: 'asc',
      },
    });
  }

  async createBranch(
    userId: string | undefined,
    body: any,
  ) {
    const user =
      await this.user(userId);

    if (
      ![
        'SUPER_ADMIN',
        'ADMIN',
        'OPERATIONS_MANAGER',
      ].includes(user.role)
    ) {
      throw new ForbiddenException(
        'Admin permission required',
      );
    }

    if (!body.name) {
      throw new BadRequestException(
        'Branch name required',
      );
    }

    const branchCode =
      await this.uniqueBranchCode();

    return this.prisma.courierBranch.create({
      data: {
        branchCode,
        tenantId: user.tenantId,

        name:
          String(body.name),

        region:
          body.region ?? null,

        state:
          body.state ?? null,

        city:
          body.city ?? null,

        address:
          body.address ?? null,

        pinCode:
          body.pinCode ?? null,

        phone:
          body.phone ?? null,

        email:
          body.email ?? null,

        locationLat:
          body.locationLat
            ? Number(body.locationLat)
            : null,

        locationLng:
          body.locationLng
            ? Number(body.locationLng)
            : null,

        servicePinCodes:
          Array.isArray(
            body.servicePinCodes,
          )
            ? body.servicePinCodes
            : [],
      },
    });
  }

  private async branchContext(
    userId: string | undefined,
    branchId: string | undefined,
  ) {
    const user =
      await this.user(userId);

    if (!branchId) {
      throw new BadRequestException(
        'X-Branch-Id required',
      );
    }

    const branch =
      await this.prisma.courierBranch.findFirst({
        where: {
          id: branchId,
          tenantId: user.tenantId,
        },
      });

    if (!branch) {
      throw new NotFoundException(
        'Branch not found',
      );
    }

    if (!this.isGlobal(user.role)) {
      const assignment =
        await this.prisma.branchUserAssignment.findFirst({
          where: {
            tenantId: user.tenantId,
            branchId,
            userId: user.id,
            status: 'ACTIVE',
          },
        });

      if (!assignment) {
        throw new ForbiddenException(
          'Branch access denied',
        );
      }
    }

    return {
      user,
      branch,
    };
  }

  async dashboard(
    userId?: string,
    branchId?: string,
  ) {
    const { user, branch } =
      await this.branchContext(
        userId,
        branchId,
      );

    const [
      pickups,
      pendingPickups,
      shipments,
      branchUsers,
      delivered,
    ] =
      await Promise.all([
        this.prisma.pickupRequest.count({
          where: {
            tenantId: user.tenantId,
            branchId: branch.id,
          },
        }),

        this.prisma.pickupRequest.count({
          where: {
            tenantId: user.tenantId,
            branchId: branch.id,

            status: {
              in: [
                'BOOKED',
                'ASSIGNED',
                'PICKUP_PENDING',
              ],
            },
          },
        }),

        this.prisma.shipment.count({
          where: {
            tenantId: user.tenantId,
            bookingBranchId: branch.id,
          },
        }),

        this.prisma.branchUserAssignment.count({
          where: {
            tenantId: user.tenantId,
            branchId: branch.id,
            status: 'ACTIVE',
          },
        }),

        this.prisma.shipment.count({
          where: {
            tenantId: user.tenantId,
            bookingBranchId: branch.id,
            status: 'DELIVERED',
          },
        }),
      ]);

    return {
      branch,

      metrics: {
        pickups,
        pendingPickups,
        shipments,
        branchUsers,
        delivered,
      },
    };
  }

  async pickups(
    userId?: string,
    branchId?: string,
  ) {
    const { user, branch } =
      await this.branchContext(
        userId,
        branchId,
      );

    return this.prisma.pickupRequest.findMany({
      where: {
        tenantId: user.tenantId,
        branchId: branch.id,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 200,
    });
  }

  async createPickup(
    userId: string | undefined,
    branchId: string | undefined,
    body: any,
  ) {
    const { user, branch } =
      await this.branchContext(
        userId,
        branchId,
      );

    if (
      !body.customerName ||
      !body.customerPhone ||
      !body.address ||
      !body.pinCode
    ) {
      throw new BadRequestException(
        'Customer name, phone, address and pin code required',
      );
    }

    const pickupCode =
      await this.uniquePickupCode();

    return this.prisma.pickupRequest.create({
      data: {
        pickupCode,

        tenantId:
          user.tenantId,

        branchId:
          branch.id,

        createdById:
          user.id,

        customerName:
          String(body.customerName),

        customerPhone:
          String(body.customerPhone),

        customerEmail:
          body.customerEmail ?? null,

        address:
          String(body.address),

        pinCode:
          String(body.pinCode),

        requestedDate:
          body.requestedDate
            ? new Date(body.requestedDate)
            : null,

        timeWindow:
          body.timeWindow ?? null,

        packageCount:
          Number(
            body.packageCount ?? 1,
          ),

        estimatedWeight:
          body.estimatedWeight
            ? Number(body.estimatedWeight)
            : null,

        remarks:
          body.remarks ?? null,
      },
    });
  }

  async shipments(
    userId?: string,
    branchId?: string,
  ) {
    const { user, branch } =
      await this.branchContext(
        userId,
        branchId,
      );

    return this.prisma.shipment.findMany({
      where: {
        tenantId: user.tenantId,
        bookingBranchId: branch.id,
      },

      include: {
        order: true,
        packages: true,
        originHub: true,
        destinationHub: true,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 200,
    });
  }

  async createShipment(
    userId: string | undefined,
    branchId: string | undefined,
    body: any,
  ) {
    const { user, branch } =
      await this.branchContext(
        userId,
        branchId,
      );

    if (
      !body.customerName ||
      !body.customerPhone
    ) {
      throw new BadRequestException(
        'Customer details required',
      );
    }

    const awb =
      await this.uniqueAwb();

    return this.prisma.$transaction(
      async tx => {
        const order =
          await tx.order.create({
            data: {
              tenantId:
                user.tenantId,

              merchantId:
                user.id,

              customerDetails: {
                name:
                  body.customerName,

                phone:
                  body.customerPhone,

                email:
                  body.customerEmail,

                address:
                  body.deliveryAddress,

                pinCode:
                  body.deliveryPinCode,
              },

              items:
                body.items ?? [],

              totalAmount:
                Number(
                  body.totalAmount ?? 0,
                ),

              paymentStatus:
                'PENDING',
            },
          });

        const shipment =
          await tx.shipment.create({
            data: {
              tenantId:
                user.tenantId,

              bookingBranchId:
                branch.id,

              orderId:
                order.id,

              awb,

              serviceType:
                body.serviceType ??
                'NORMAL',

              status:
                'PENDING',

              originHubId:
                body.originHubId ??
                null,

              destinationHubId:
                body.destinationHubId ??
                null,
            },
          });

        return {
          success: true,
          awb,
          order,
          shipment,
        };
      },
    );
  }

  async users(
    userId?: string,
    branchId?: string,
  ) {
    const { user, branch } =
      await this.branchContext(
        userId,
        branchId,
      );

    const assignments =
      await this.prisma.branchUserAssignment.findMany({
        where: {
          tenantId: user.tenantId,
          branchId: branch.id,
        },
      });

    const users =
      await this.prisma.user.findMany({
        where: {
          id: {
            in: assignments.map(
              x => x.userId,
            ),
          },
        },

        select: {
          id: true,
          userCode: true,
          phone: true,
          email: true,
          role: true,
          status: true,
        },
      });

    return users;
  }

  async createUser(
    userId: string | undefined,
    branchId: string | undefined,
    body: any,
  ) {
    const { user, branch } =
      await this.branchContext(
        userId,
        branchId,
      );

    const managerRoles = [
      'SUPER_ADMIN',
      'ADMIN',
      'OPERATIONS_MANAGER',
      'REGIONAL_MANAGER',
      'BRANCH_MANAGER',
    ];

    if (
      !managerRoles.includes(
        user.role,
      )
    ) {
      throw new ForbiddenException(
        'Manager access required',
      );
    }

    if (!body.phone) {
      throw new BadRequestException(
        'Phone required',
      );
    }

    const allowedRoles = [
      'REGIONAL_MANAGER',
      'BRANCH_MANAGER',
      'BRANCH_STAFF',
      'BOOKING_AGENT',
    ];

    const role =
      allowedRoles.includes(body.role)
        ? body.role
        : 'BRANCH_STAFF';

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
                    String(body.email),
                }
              : undefined,
          ].filter(Boolean) as any,
        },
      });

    if (existing) {
      throw new BadRequestException(
        'Phone/email already registered',
      );
    }

    const userCode =
      await this.uniqueUserCode();

    const password =
      generatedPassword();

    const passwordHash =
      await bcrypt.hash(
        password,
        12,
      );

    const created =
      await this.prisma.user.create({
        data: {
          tenantId:
            user.tenantId,

          userCode,

          role:
            role as any,

          phone:
            String(body.phone),

          email:
            body.email ?? null,

          passwordHash,

          status:
            'ACTIVE',
        },
      });

    await this.prisma.branchUserAssignment.create({
      data: {
        tenantId:
          user.tenantId,

        branchId:
          branch.id,

        userId:
          created.id,

        role,

        isPrimary:
          true,
      },
    });

    return {
      success: true,

      credentials: {
        userId:
          userCode,

        password,
      },

      user: {
        id:
          created.id,

        userId:
          userCode,

        phone:
          created.phone,

        email:
          created.email,

        role:
          created.role,
      },
    };
  }
}