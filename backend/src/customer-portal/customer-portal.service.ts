import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  randomInt,
} from 'node:crypto';

import {
  PrismaService,
} from '../prisma/prisma.service.js';

@Injectable()
export class CustomerPortalService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private numeric12() {
    let value =
      String(
        randomInt(1, 10),
      );

    for (
      let index = 1;
      index < 12;
      index++
    ) {
      value +=
        String(
          randomInt(0, 10),
        );
    }

    return value;
  }

  private async customer(
    userId?: string,
  ) {
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

    if (
      user.role !== 'CUSTOMER' &&
      ![
        'SUPER_ADMIN',
        'ADMIN',
      ].includes(user.role)
    ) {
      throw new ForbiddenException(
        'Customer portal access required.',
      );
    }

    return user;
  }

  private async uniqueAwb() {
    let value = this.numeric12();

    while (
      await this.prisma.shipment.findUnique({
        where: {
          awb: value,
        },
      })
    ) {
      value = this.numeric12();
    }

    return value;
  }

  private async uniqueBarcode() {
    let value = this.numeric12();

    while (
      await this.prisma.package.findFirst({
        where: {
          barcode: value,
        },
      })
    ) {
      value = this.numeric12();
    }

    return value;
  }

  async me(userId?: string) {
    const user =
      await this.customer(userId);

    return {
      id: user.id,
      userId: user.userCode,
      role: user.role,
      phone: user.phone,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt,
    };
  }

  async dashboard(userId?: string) {
    const user =
      await this.customer(userId);

    const orders =
      await this.prisma.order.findMany({
        where: {
          tenantId: user.tenantId,
          merchantId: user.id,
        },

        select: {
          id: true,
        },
      });

    const orderIds =
      orders.map(
        item => item.id,
      );

    const [
      total,
      active,
      delivered,
      exceptions,
      addresses,
      openTickets,
      recent,
    ] =
      await Promise.all([
        this.prisma.shipment.count({
          where: {
            tenantId: user.tenantId,
            orderId: {
              in: orderIds,
            },
          },
        }),

        this.prisma.shipment.count({
          where: {
            tenantId: user.tenantId,
            orderId: {
              in: orderIds,
            },
            status: {
              notIn: [
                'DELIVERED',
                'CANCELLED',
                'RETURNED',
              ],
            },
          },
        }),

        this.prisma.shipment.count({
          where: {
            tenantId: user.tenantId,
            orderId: {
              in: orderIds,
            },
            status: 'DELIVERED',
          },
        }),

        this.prisma.shipment.count({
          where: {
            tenantId: user.tenantId,
            orderId: {
              in: orderIds,
            },
            status: {
              in: [
                'EXCEPTION',
                'FAILED',
                'LOST',
                'DAMAGED',
              ],
            },
          },
        }),

        this.prisma.customerAddress.count({
          where: {
            tenantId: user.tenantId,
            userId: user.id,
            status: 'ACTIVE',
          },
        }),

        this.prisma.customerSupportTicket.count({
          where: {
            tenantId: user.tenantId,
            userId: user.id,
            status: {
              in: [
                'OPEN',
                'IN_PROGRESS',
              ],
            },
          },
        }),

        this.prisma.shipment.findMany({
          where: {
            tenantId: user.tenantId,
            orderId: {
              in: orderIds,
            },
          },

          include: {
            order: true,
          },

          orderBy: {
            createdAt: 'desc',
          },

          take: 5,
        }),
      ]);

    return {
      customer: {
        id: user.id,
        userId: user.userCode,
        phone: user.phone,
        email: user.email,
      },

      stats: {
        total,
        active,
        delivered,
        exceptions,
        addresses,
        openTickets,
      },

      recentShipments:
        recent,
    };
  }

  async addresses(userId?: string) {
    const user =
      await this.customer(userId);

    return this.prisma.customerAddress.findMany({
      where: {
        tenantId: user.tenantId,
        userId: user.id,
        status: 'ACTIVE',
      },

      orderBy: [
        {
          isDefault: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  async createAddress(
    userId: string | undefined,
    body: any,
  ) {
    const user =
      await this.customer(userId);

    const required = [
      'contactName',
      'phone',
      'line1',
      'city',
      'state',
      'pinCode',
    ];

    for (const key of required) {
      if (!body[key]) {
        throw new BadRequestException(
          `${key} is required.`,
        );
      }
    }

    const addressCode =
      this.numeric12();

    if (body.isDefault) {
      await this.prisma.customerAddress.updateMany({
        where: {
          tenantId: user.tenantId,
          userId: user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    return this.prisma.customerAddress.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        addressCode,
        label:
          body.label ?? 'Home',
        contactName:
          String(body.contactName),
        phone:
          String(body.phone),
        line1:
          String(body.line1),
        line2:
          body.line2 ?? null,
        landmark:
          body.landmark ?? null,
        city:
          String(body.city),
        state:
          String(body.state),
        pinCode:
          String(body.pinCode),
        country:
          body.country ?? 'India',
        latitude:
          body.latitude != null
            ? Number(body.latitude)
            : null,
        longitude:
          body.longitude != null
            ? Number(body.longitude)
            : null,
        isDefault:
          Boolean(body.isDefault),
      },
    });
  }

  async deleteAddress(
    userId: string | undefined,
    id: string,
  ) {
    const user =
      await this.customer(userId);

    const address =
      await this.prisma.customerAddress.findFirst({
        where: {
          id,
          tenantId: user.tenantId,
          userId: user.id,
        },
      });

    if (!address) {
      throw new NotFoundException(
        'Address not found.',
      );
    }

    await this.prisma.customerAddress.update({
      where: {
        id,
      },

      data: {
        status: 'INACTIVE',
        isDefault: false,
      },
    });

    return {
      success: true,
    };
  }

  async setDefaultAddress(
    userId: string | undefined,
    id: string,
  ) {
    const user =
      await this.customer(userId);

    const address =
      await this.prisma.customerAddress.findFirst({
        where: {
          id,
          tenantId: user.tenantId,
          userId: user.id,
          status: 'ACTIVE',
        },
      });

    if (!address) {
      throw new NotFoundException(
        'Address not found.',
      );
    }

    await this.prisma.$transaction([
      this.prisma.customerAddress.updateMany({
        where: {
          tenantId: user.tenantId,
          userId: user.id,
        },
        data: {
          isDefault: false,
        },
      }),

      this.prisma.customerAddress.update({
        where: {
          id,
        },
        data: {
          isDefault: true,
        },
      }),
    ]);

    return {
      success: true,
    };
  }

  async shipments(userId?: string) {
    const user =
      await this.customer(userId);

    const orders =
      await this.prisma.order.findMany({
        where: {
          tenantId: user.tenantId,
          merchantId: user.id,
        },

        select: {
          id: true,
        },
      });

    return this.prisma.shipment.findMany({
      where: {
        tenantId: user.tenantId,
        orderId: {
          in:
            orders.map(
              item => item.id,
            ),
        },
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
    body: any,
  ) {
    const user =
      await this.customer(userId);

    const serviceType =
      String(
        body.serviceType ??
        'NORMAL',
      ).toUpperCase();

    if (
      ![
        'NORMAL',
        'HYPERLOCAL',
      ].includes(serviceType)
    ) {
      throw new BadRequestException(
        'Invalid service type.',
      );
    }

    if (
      !body.sender ||
      !body.receiver
    ) {
      throw new BadRequestException(
        'Sender and receiver details are required.',
      );
    }

    if (
      !body.sender.address ||
      !body.sender.pinCode ||
      !body.receiver.address ||
      !body.receiver.pinCode
    ) {
      throw new BadRequestException(
        'Complete pickup and delivery addresses are required.',
      );
    }

    const awb =
      await this.uniqueAwb();

    const barcode =
      await this.uniqueBarcode();

    return this.prisma.$transaction(
      async tx => {
        const order =
          await tx.order.create({
            data: {
              tenantId: user.tenantId,

              merchantId: user.id,

              customerDetails: {
                sender:
                  body.sender,

                receiver:
                  body.receiver,

                serviceType,

                paymentMethod:
                  body.paymentMethod ??
                  'PREPAID',
              },

              items:
                body.items ?? [
                  {
                    description:
                      body.description ??
                      'Parcel',

                    quantity:
                      1,
                  },
                ],

              totalAmount:
                Number(
                  body.totalAmount ??
                  0,
                ),

              paymentStatus:
                body.paymentMethod ===
                'COD'
                  ? 'PENDING'
                  : 'PENDING',
            },
          });

        const shipment =
          await tx.shipment.create({
            data: {
              tenantId:
                user.tenantId,

              orderId:
                order.id,

              awb,

              serviceType,

              status:
                serviceType ===
                'HYPERLOCAL'
                  ? 'PENDING'
                  : 'PENDING',

              obdRequired:
                Boolean(
                  body.obdRequired,
                ),
            },
          });

        const pkg =
          await tx.package.create({
            data: {
              tenantId:
                user.tenantId,

              shipmentId:
                shipment.id,

              packageNumber:
                1,

              barcode,

              referenceCode:
                body.referenceCode ??
                null,

              status:
                'CREATED',

              weight:
                body.weight != null
                  ? Number(
                      body.weight,
                    )
                  : null,

              dimensions:
                body.dimensions ??
                null,

              itemCount:
                Number(
                  body.itemCount ??
                  1,
                ),

              declaredValue:
                body.declaredValue != null
                  ? Number(
                      body.declaredValue,
                    )
                  : null,
            },
          });

        return {
          success: true,
          awb,
          serviceType,
          order,
          shipment,
          package: pkg,
        };
      },
    );
  }

  async paymentMethods(userId?: string) {
    const user =
      await this.customer(userId);

    return this.prisma.customerPaymentMethod.findMany({
      where: {
        tenantId: user.tenantId,
        userId: user.id,
        status: 'ACTIVE',
      },

      orderBy: [
        {
          isDefault: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  async addPaymentMethod(
    userId: string | undefined,
    body: any,
  ) {
    const user =
      await this.customer(userId);

    const type =
      String(
        body.type ??
        '',
      ).toUpperCase();

    if (
      ![
        'CARD',
        'UPI',
        'COD',
      ].includes(type)
    ) {
      throw new BadRequestException(
        'Unsupported payment method.',
      );
    }

    /*
     * Never accept or store PAN/CVV here.
     * Store gateway token / last4 only.
     */
    if (
      body.cardNumber ||
      body.cvv
    ) {
      throw new BadRequestException(
        'Raw card numbers and CVV must not be stored.',
      );
    }

    if (body.isDefault) {
      await this.prisma.customerPaymentMethod.updateMany({
        where: {
          tenantId: user.tenantId,
          userId: user.id,
        },

        data: {
          isDefault: false,
        },
      });
    }

    return this.prisma.customerPaymentMethod.create({
      data: {
        tenantId:
          user.tenantId,

        userId:
          user.id,

        methodCode:
          this.numeric12(),

        type,

        label:
          body.label ??
          type,

        provider:
          body.provider ??
          null,

        providerToken:
          body.providerToken ??
          null,

        brand:
          body.brand ??
          null,

        last4:
          body.last4 ??
          null,

        isDefault:
          Boolean(
            body.isDefault,
          ),
      },
    });
  }

  async deletePaymentMethod(
    userId: string | undefined,
    id: string,
  ) {
    const user =
      await this.customer(userId);

    const method =
      await this.prisma.customerPaymentMethod.findFirst({
        where: {
          id,
          tenantId:
            user.tenantId,
          userId:
            user.id,
        },
      });

    if (!method) {
      throw new NotFoundException(
        'Payment method not found.',
      );
    }

    await this.prisma.customerPaymentMethod.update({
      where: {
        id,
      },

      data: {
        status:
          'INACTIVE',
        isDefault:
          false,
      },
    });

    return {
      success: true,
    };
  }

  async tickets(userId?: string) {
    const user =
      await this.customer(userId);

    return this.prisma.customerSupportTicket.findMany({
      where: {
        tenantId:
          user.tenantId,
        userId:
          user.id,
      },

      orderBy: {
        updatedAt:
          'desc',
      },
    });
  }

  async createTicket(
    userId: string | undefined,
    body: any,
  ) {
    const user =
      await this.customer(userId);

    if (
      !body.subject ||
      !body.message
    ) {
      throw new BadRequestException(
        'Subject and message are required.',
      );
    }

    const ticket =
      await this.prisma.customerSupportTicket.create({
        data: {
          tenantId:
            user.tenantId,

          userId:
            user.id,

          ticketCode:
            this.numeric12(),

          shipmentId:
            body.shipmentId ??
            null,

          awb:
            body.awb ??
            null,

          category:
            body.category ??
            'GENERAL',

          subject:
            body.subject,

          priority:
            body.priority ??
            'NORMAL',
        },
      });

    await this.prisma.customerSupportMessage.create({
      data: {
        ticketId:
          ticket.id,

        senderId:
          user.id,

        senderType:
          'CUSTOMER',

        message:
          body.message,
      },
    });

    return ticket;
  }

  async ticketMessages(
    userId: string | undefined,
    ticketId: string,
  ) {
    const user =
      await this.customer(userId);

    const ticket =
      await this.prisma.customerSupportTicket.findFirst({
        where: {
          id:
            ticketId,

          tenantId:
            user.tenantId,

          userId:
            user.id,
        },
      });

    if (!ticket) {
      throw new NotFoundException(
        'Support ticket not found.',
      );
    }

    return this.prisma.customerSupportMessage.findMany({
      where: {
        ticketId:
          ticket.id,
      },

      orderBy: {
        createdAt:
          'asc',
      },
    });
  }

  async addTicketMessage(
    userId: string | undefined,
    ticketId: string,
    body: any,
  ) {
    const user =
      await this.customer(userId);

    if (!body.message) {
      throw new BadRequestException(
        'Message is required.',
      );
    }

    const ticket =
      await this.prisma.customerSupportTicket.findFirst({
        where: {
          id:
            ticketId,

          tenantId:
            user.tenantId,

          userId:
            user.id,
        },
      });

    if (!ticket) {
      throw new NotFoundException(
        'Support ticket not found.',
      );
    }

    const message =
      await this.prisma.customerSupportMessage.create({
        data: {
          ticketId:
            ticket.id,

          senderId:
            user.id,

          senderType:
            'CUSTOMER',

          message:
            body.message,
        },
      });

    await this.prisma.customerSupportTicket.update({
      where: {
        id:
          ticket.id,
      },

      data: {
        status:
          ticket.status ===
          'RESOLVED'
            ? 'OPEN'
            : ticket.status,
      },
    });

    return message;
  }
}