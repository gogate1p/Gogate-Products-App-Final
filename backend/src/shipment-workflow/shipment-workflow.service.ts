import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  randomInt,
} from 'node:crypto';

import {
  PrismaService,
} from '../prisma/prisma.service.js';

@Injectable()
export class ShipmentWorkflowService {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  private encryptionKey() {
    return createHash(
      'sha256',
    )
      .update(
        process.env.OTP_ENCRYPTION_KEY ||
        process.env.JWT_SECRET ||
        'gogate-development-key',
      )
      .digest();
  }

  private encrypt(
    value: string,
  ) {
    const iv =
      randomBytes(12);

    const cipher =
      createCipheriv(
        'aes-256-gcm',
        this.encryptionKey(),
        iv,
      );

    const encrypted =
      Buffer.concat([
        cipher.update(
          value,
          'utf8',
        ),
        cipher.final(),
      ]);

    const tag =
      cipher.getAuthTag();

    return [
      iv.toString('base64'),
      tag.toString('base64'),
      encrypted.toString('base64'),
    ].join('.');
  }

  decrypt(
    value?: string | null,
  ) {
    if (!value) {
      return null;
    }

    try {
      const [
        ivValue,
        tagValue,
        dataValue,
      ] =
        value.split('.');

      const decipher =
        createDecipheriv(
          'aes-256-gcm',
          this.encryptionKey(),
          Buffer.from(
            ivValue,
            'base64',
          ),
        );

      decipher.setAuthTag(
        Buffer.from(
          tagValue,
          'base64',
        ),
      );

      return Buffer.concat([
        decipher.update(
          Buffer.from(
            dataValue,
            'base64',
          ),
        ),
        decipher.final(),
      ]).toString('utf8');

    } catch {
      return null;
    }
  }

  private hashOtp(
    otp: string,
  ) {
    return createHash(
      'sha256',
    )
      .update(otp)
      .digest('hex');
  }

  private async actor(
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

    return user;
  }

  private normalizeCode(
    rawCode: string,
  ) {
    let code =
      String(
        rawCode ?? '',
      ).trim();

    /*
     * Shipping-label QR format:
     * GOGATE:SHIPMENT:850067564871
     */
    if (
      code.startsWith(
        'GOGATE:SHIPMENT:',
      )
    ) {
      code =
        code.split(':').pop() ??
        code;
    }

    return code;
  }

  async resolveShipment(
    rawCode: string,
  ) {
    const code =
      this.normalizeCode(
        rawCode,
      );

    let shipment =
      await this.prisma.shipment.findUnique({
        where: {
          awb: code,
        },

        include: {
          order: true,
          packages: true,
          currentHub: true,
          originHub: true,
          destinationHub: true,
        },
      });

    if (shipment) {
      return shipment;
    }

    const pkg =
      await this.prisma.package.findFirst({
        where: {
          OR: [
            {
              barcode: code,
            },
            {
              qrCode: rawCode,
            },
          ],
        },

        include: {
          shipment: {
            include: {
              order: true,
              packages: true,
              currentHub: true,
              originHub: true,
              destinationHub: true,
            },
          },
        },
      });

    if (!pkg) {
      throw new NotFoundException(
        'Shipment or package not found.',
      );
    }

    return pkg.shipment;
  }

  private async createOtp(
    shipmentId: string,
    type:
      'PICKUP' |
      'DELIVERY',
  ) {
    const existing =
      await this.prisma.shipmentOtp.findFirst({
        where: {
          shipmentId,
          type,
          status:
            'ACTIVE',
          expiresAt: {
            gt:
              new Date(),
          },
        },

        orderBy: {
          createdAt:
            'desc',
        },
      });

    if (existing) {
      return existing;
    }

    const otp =
      String(
        randomInt(
          100000,
          1000000,
        ),
      );

    await this.prisma.shipmentOtp.updateMany({
      where: {
        shipmentId,
        type,
        status:
          'ACTIVE',
      },

      data: {
        status:
          'REVOKED',
      },
    });

    return this.prisma.shipmentOtp.create({
      data: {
        shipmentId,
        type,

        otpHash:
          this.hashOtp(
            otp,
          ),

        cipherText:
          this.encrypt(
            otp,
          ),

        expiresAt:
          new Date(
            Date.now() +
            30 *
            60 *
            1000,
          ),
      },
    });
  }

  private async verifyOtp(
    shipmentId: string,
    type:
      'PICKUP' |
      'DELIVERY',
    otp?: string,
  ) {
    if (!otp) {
      throw new BadRequestException(
        `${type} OTP is required.`,
      );
    }

    const record =
      await this.prisma.shipmentOtp.findFirst({
        where: {
          shipmentId,
          type,
          status:
            'ACTIVE',
        },

        orderBy: {
          createdAt:
            'desc',
        },
      });

    if (
      !record ||
      record.expiresAt <
        new Date()
    ) {
      throw new BadRequestException(
        `${type} OTP has expired.`,
      );
    }

    if (
      record.otpHash !==
      this.hashOtp(
        String(otp),
      )
    ) {
      await this.prisma.shipmentOtp.update({
        where: {
          id:
            record.id,
        },

        data: {
          attempts: {
            increment:
              1,
          },
        },
      });

      throw new BadRequestException(
        `Invalid ${type} OTP.`,
      );
    }

    await this.prisma.shipmentOtp.update({
      where: {
        id:
          record.id,
      },

      data: {
        status:
          'USED',

        usedAt:
          new Date(),
      },
    });
  }

  private statusForScan(
    scanType: string,
  ) {
    const map:
      Record<
        string,
        string
      > = {

      SHIPMENT_CREATED:
        'PENDING',

      OUT_FOR_PICKUP:
        'OUT_FOR_PICKUP',

      PICKUP_CONFIRMED:
        'PICKED_UP',

      HUB_INBOUND:
        'AT_HUB',

      HUB_RECEIVED:
        'AT_HUB',

      BAGGED:
        'BAGGED',

      MANIFESTED:
        'MANIFESTED',

      LINEHAUL_DISPATCH:
        'SHIPPED',

      TRUCK_DEPARTED:
        'IN_TRANSIT',

      TRUCK_IN_TRANSIT:
        'IN_TRANSIT',

      TRUCK_ARRIVED:
        'AT_HUB',

      DESTINATION_HUB_RECEIVED:
        'RECEIVED',

      OUT_FOR_DELIVERY:
        'OUT_FOR_DELIVERY',

      DELIVERY_CONFIRMED:
        'DELIVERED',

      DELIVERY_FAILED:
        'FAILED',

      EXCEPTION:
        'EXCEPTION',
    };

    return (
      map[
        String(
          scanType,
        ).toUpperCase()
      ] ??
      null
    );
  }

  async scan(
    userId:
      string | undefined,

    body:
      any,
  ) {
    const actor =
      await this.actor(
        userId,
      );

    const allowedRoles = [
      'SUPER_ADMIN',
      'ADMIN',
      'OPERATIONS_MANAGER',
      'DISPATCHER',
      'HUB_MANAGER',
      'HUB_PERSONNEL',
      'RIDER',
      'DRIVER',
    ];

    if (
      !allowedRoles.includes(
        actor.role,
      )
    ) {
      throw new ForbiddenException(
        'Scanning is not permitted for this account.',
      );
    }

    if (!body.code) {
      throw new BadRequestException(
        'Barcode or QR code is required.',
      );
    }

    if (!body.scanType) {
      throw new BadRequestException(
        'scanType is required.',
      );
    }

    const shipment =
      await this.resolveShipment(
        body.code,
      );

    if (
      shipment.tenantId !==
      actor.tenantId
    ) {
      throw new ForbiddenException(
        'Shipment belongs to another tenant.',
      );
    }

    const scanType =
      String(
        body.scanType,
      ).toUpperCase();

    const nextStatus =
      this.statusForScan(
        scanType,
      );

    if (!nextStatus) {
      throw new BadRequestException(
        `Unsupported scan type: ${scanType}`,
      );
    }

    /*
     * Pickup confirmation requires pickup OTP.
     */
    if (
      scanType ===
      'PICKUP_CONFIRMED'
    ) {
      await this.verifyOtp(
        shipment.id,
        'PICKUP',
        body.otp,
      );
    }

    /*
     * Delivery confirmation requires receiver OTP.
     */
    if (
      scanType ===
      'DELIVERY_CONFIRMED'
    ) {
      await this.verifyOtp(
        shipment.id,
        'DELIVERY',
        body.otp,
      );
    }

    /*
     * OTPs are generated by the system only when the
     * shipment reaches the correct operational state.
     */
    if (
      scanType ===
      'OUT_FOR_PICKUP'
    ) {
      await this.createOtp(
        shipment.id,
        'PICKUP',
      );
    }

    if (
      scanType ===
      'OUT_FOR_DELIVERY'
    ) {
      await this.createOtp(
        shipment.id,
        'DELIVERY',
      );
    }

    const pkg =
      shipment.packages?.[0];

    await this.prisma.$transaction(
      async tx => {

        await tx.shipment.update({
          where: {
            id:
              shipment.id,
          },

          data: {
            status:
              nextStatus,

            currentHubId:
              body.hubId ??
              shipment.currentHubId,

            deliveredAt:
              scanType ===
              'DELIVERY_CONFIRMED'
                ? new Date()
                : undefined,

            receivedByName:
              scanType ===
              'DELIVERY_CONFIRMED'
                ? (
                    body.receivedBy ??
                    shipment.receivedByName
                  )
                : undefined,
          },
        });

        await tx.shipmentEvent.create({
          data: {
            shipmentId:
              shipment.id,

            status:
              nextStatus,

            userId:
              actor.id,

            deviceId:
              body.deviceId ??
              null,

            locationLat:
              body.gpsLat != null
                ? Number(
                    body.gpsLat,
                  )
                : null,

            locationLng:
              body.gpsLng != null
                ? Number(
                    body.gpsLng,
                  )
                : null,

            metadata: {
              scanType,

              actorRole:
                actor.role,

              hubId:
                body.hubId ??
                null,

              manifestId:
                body.manifestId ??
                null,

              runsheetId:
                body.runsheetId ??
                null,

              vehicleId:
                body.vehicleId ??
                null,

              receivedBy:
                body.receivedBy ??
                null,
            },
          },
        });

        await tx.packageScan.create({
          data: {
            tenantId:
              shipment.tenantId,

            shipmentId:
              shipment.id,

            packageId:
              pkg?.id ??
              null,

            hubId:
              body.hubId ??
              null,

            manifestId:
              body.manifestId ??
              null,

            runsheetId:
              body.runsheetId ??
              null,

            riderId:
              actor.role ===
              'RIDER'
                ? actor.id
                : null,

            userId:
              actor.id,

            scanType,

            scanValue:
              String(
                body.code,
              ),

            deviceId:
              body.deviceId ??
              null,

            actorRole:
              actor.role,

            gpsLat:
              body.gpsLat != null
                ? Number(
                    body.gpsLat,
                  )
                : null,

            gpsLng:
              body.gpsLng != null
                ? Number(
                    body.gpsLng,
                  )
                : null,

            gpsAccuracy:
              body.gpsAccuracy != null
                ? Number(
                    body.gpsAccuracy,
                  )
                : null,

            status:
              'VALID',

            metadata: {
              resultingShipmentStatus:
                nextStatus,
            },

            createdByUserId:
              actor.id,
          },
        });
      },
    );

    return this.scanResult(
      shipment.awb,
    );
  }

  async scanResult(
    awb: string,
  ) {
    const shipment =
      await this.prisma.shipment.findUnique({
        where: {
          awb,
        },

        include: {
          order: true,
          packages: true,
          originHub: true,
          destinationHub: true,
          currentHub: true,
        },
      });

    if (!shipment) {
      throw new NotFoundException();
    }

    const details: any =
      shipment.order
        .customerDetails ??
      {};

    const paymentMethod =
      String(
        details.paymentMethod ??
        'PREPAID',
      ).toUpperCase();

    return {
      shipmentId:
        shipment.awb,

      status:
        shipment.status,

      serviceType:
        shipment.serviceType,

      packageBarcode:
        shipment.packages?.[0]
          ?.barcode,

      payment: {
        method:
          paymentMethod,

        amount:
          shipment.order.totalAmount,

        amountToCollect:
          paymentMethod ===
          'COD'
            ? shipment.order.totalAmount
            : 0,

        status:
          shipment.order.paymentStatus,
      },

      sender:
        details.sender ??
        null,

      receiver:
        details.receiver ??
        null,

      currentHub:
        shipment.currentHub,

      destinationHub:
        shipment.destinationHub,
    };
  }

  async activeOtp(
    shipmentId: string,
    type:
      'PICKUP' |
      'DELIVERY',
  ) {
    const otp =
      await this.prisma.shipmentOtp.findFirst({
        where: {
          shipmentId,
          type,
          status:
            'ACTIVE',

          expiresAt: {
            gt:
              new Date(),
          },
        },

        orderBy: {
          createdAt:
            'desc',
        },
      });

    if (!otp) {
      return null;
    }

    return {
      type,
      otp:
        this.decrypt(
          otp.cipherText,
        ),

      expiresAt:
        otp.expiresAt,
    };
  }
}