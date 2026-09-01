import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AssignmentService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private async requester(userId?: string) {
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

  private async admin(userId?: string) {
    const user =
      await this.requester(userId);

    if (
      ![
        'SUPER_ADMIN',
        'ADMIN',
        'OPERATIONS_MANAGER',
      ].includes(user.role)
    ) {
      throw new ForbiddenException(
        'Admin or operations access required.',
      );
    }

    return user;
  }

  async list(userId?: string) {
    const admin =
      await this.admin(userId);

    return this.prisma.portalAssignment.findMany({
      where: {
        tenantId:
          admin.tenantId,
      },

      orderBy: {
        createdAt:
          'desc',
      },
    });
  }

  async create(
    userId: string | undefined,
    body: any,
  ) {
    const admin =
      await this.admin(userId);

    if (!body.userId) {
      throw new BadRequestException(
        'User is required.',
      );
    }

    if (!body.scopeType) {
      throw new BadRequestException(
        'Scope type is required.',
      );
    }

    const target =
      await this.prisma.user.findFirst({
        where: {
          id:
            body.userId,

          tenantId:
            admin.tenantId,
        },
      });

    if (!target) {
      throw new NotFoundException(
        'Target user not found.',
      );
    }

    if (body.isPrimary) {
      await this.prisma.portalAssignment.updateMany({
        where: {
          tenantId:
            admin.tenantId,

          userId:
            target.id,

          scopeType:
            String(
              body.scopeType,
            ),

          isPrimary:
            true,

          status:
            'ACTIVE',
        },

        data: {
          isPrimary:
            false,
        },
      });
    }

    return this.prisma.portalAssignment.create({
      data: {
        tenantId:
          admin.tenantId,

        userId:
          target.id,

        scopeType:
          String(body.scopeType),

        scopeId:
          body.scopeId
            ? String(body.scopeId)
            : null,

        scopeCode:
          body.scopeCode
            ? String(body.scopeCode)
            : null,

        scopeName:
          body.scopeName
            ? String(body.scopeName)
            : null,

        region:
          body.region
            ? String(body.region)
            : null,

        permissions:
          Array.isArray(
            body.permissions,
          )
            ? body.permissions
            : [],

        isPrimary:
          Boolean(
            body.isPrimary,
          ),

        effectiveFrom:
          body.effectiveFrom
            ? new Date(
                body.effectiveFrom,
              )
            : new Date(),

        createdById:
          admin.id,
      },
    });
  }

  async deactivate(
    userId: string | undefined,
    assignmentId: string,
  ) {
    const admin =
      await this.admin(userId);

    const assignment =
      await this.prisma.portalAssignment.findFirst({
        where: {
          id:
            assignmentId,

          tenantId:
            admin.tenantId,
        },
      });

    if (!assignment) {
      throw new NotFoundException(
        'Assignment not found.',
      );
    }

    return this.prisma.portalAssignment.update({
      where: {
        id:
          assignment.id,
      },

      data: {
        status:
          'INACTIVE',

        effectiveTo:
          new Date(),
      },
    });
  }

  async myAssignments(
    userId?: string,
  ) {
    const user =
      await this.requester(userId);

    return this.prisma.portalAssignment.findMany({
      where: {
        tenantId:
          user.tenantId,

        userId:
          user.id,

        status:
          'ACTIVE',
      },

      orderBy: [
        {
          isPrimary:
            'desc',
        },

        {
          createdAt:
            'asc',
        },
      ],
    });
  }

  async scopes(userId?: string) {
    const admin =
      await this.admin(userId);

    const [
      hubs,
      branches,
      users,
    ] =
      await Promise.all([
        this.prisma.hub.findMany({
          where: {
            tenantId:
              admin.tenantId,
          },

          select: {
            id: true,
            hubCode: true,
            name: true,
            type: true,
          },

          orderBy: {
            name:
              'asc',
          },
        }),

        this.prisma.courierBranch.findMany({
          where: {
            tenantId:
              admin.tenantId,
          },

          select: {
            id: true,
            branchCode: true,
            name: true,
            region: true,
            city: true,
          },

          orderBy: {
            name:
              'asc',
          },
        }),

        this.prisma.user.findMany({
          where: {
            tenantId:
              admin.tenantId,
          },

          select: {
            id: true,
            userCode: true,
            phone: true,
            email: true,
            role: true,
            status: true,
          },

          orderBy: {
            createdAt:
              'desc',
          },
        }),
      ]);

    const regions =
      Array.from(
        new Set(
          branches
            .map(
              branch =>
                branch.region,
            )
            .filter(Boolean),
        ),
      );

    return {
      hubs,
      branches,
      users,
      regions,
    };
  }
}