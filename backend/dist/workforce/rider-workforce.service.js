var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RiderWorkforceService_1;
import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
const VALID_KYC_TRANSITIONS = {
    'DRAFT': ['SUBMITTED', 'DOCUMENTS_PENDING'],
    'SUBMITTED': ['UNDER_REVIEW', 'DOCUMENTS_PENDING'],
    'UNDER_REVIEW': ['DOCUMENTS_PENDING', 'VERIFIED', 'REJECTED'],
    'DOCUMENTS_PENDING': ['SUBMITTED', 'UNDER_REVIEW'],
    'VERIFIED': ['EXPIRED'],
    'REJECTED': ['SUBMITTED'],
    'EXPIRED': ['SUBMITTED'],
};
const DEFAULT_GEOFENCE_RADIUS_METERS = 100;
const MIN_GPS_ACCURACY_METERS = 50;
const POOR_GPS_ACCURACY_METERS = 100;
let RiderWorkforceService = RiderWorkforceService_1 = class RiderWorkforceService {
    prisma;
    logger = new Logger(RiderWorkforceService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    parseDate(value) {
        if (!value)
            return null;
        const date = value instanceof Date ? value : new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }
    async assertTenantRole(userRole, allowed) {
        if (!userRole || !allowed.includes(userRole)) {
            throw new ForbiddenException('FORBIDDEN');
        }
    }
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371000;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLng = ((lng2 - lng1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    validateKycTransition(currentStatus, newStatus) {
        const allowedTransitions = VALID_KYC_TRANSITIONS[currentStatus];
        return allowedTransitions ? allowedTransitions.includes(newStatus) : false;
    }
    async signupRider(input) {
        const existing = await this.prisma.user.findFirst({
            where: { tenantId: input.tenantId, phone: input.phone },
        });
        if (existing) {
            throw new BadRequestException('DUPLICATE_PHONE');
        }
        const user = await this.prisma.user.create({
            data: {
                tenantId: input.tenantId,
                phone: input.phone,
                email: input.email ?? null,
                passwordHash: input.passwordHash,
                role: 'RIDER',
                status: 'ACTIVE',
            },
        });
        const riderProfile = await this.prisma.riderProfile.create({
            data: {
                tenantId: input.tenantId,
                userId: user.id,
                riderCode: `RDR-${Date.now()}`,
                riderState: 'APPLICANT',
                onboardingStatus: 'PROFILE_CREATED',
                preferredHubId: input.preferredHubId,
                serviceArea: input.serviceArea,
            },
        });
        return {
            userId: user.id,
            riderProfileId: riderProfile.id,
            riderState: riderProfile.riderState,
            status: 'APPLICANT',
        };
    }
    async resolveOwnedRiderProfile(input) {
        if (!input.userId) {
            throw new ForbiddenException('UNAUTHENTICATED_USER');
        }
        const riderProfile = await this.prisma.riderProfile.findFirst({
            where: {
                tenantId: input.tenantId,
                userId: input.userId,
            },
        });
        if (!riderProfile) {
            throw new ForbiddenException('RIDER_PROFILE_NOT_FOUND');
        }
        if (input.riderProfileId && riderProfile.id !== input.riderProfileId) {
            this.logger.warn(`Ignoring client supplied riderProfileId ${input.riderProfileId}; authenticated rider ${riderProfile.id} is authoritative for tenant ${input.tenantId}`);
        }
        return riderProfile;
    }
    async submitKyc(input) {
        const rider = await this.prisma.riderProfile.findFirst({
            where: { id: input.riderProfileId, tenantId: input.tenantId },
        });
        if (!rider) {
            throw new NotFoundException('RIDER_NOT_FOUND');
        }
        if (!input.userId) {
            throw new ForbiddenException('UNAUTHENTICATED_USER');
        }
        if (rider.userId !== input.userId) {
            throw new ForbiddenException('RIDER_PROFILE_NOT_ACCESSIBLE');
        }
        const existingKyc = await this.prisma.riderKyc.findFirst({
            where: { tenantId: input.tenantId, riderProfileId: rider.id },
        });
        if (existingKyc) {
            return this.prisma.riderKyc.update({
                where: { id: existingKyc.id },
                data: { status: 'SUBMITTED', submittedAt: new Date() },
            });
        }
        return this.prisma.riderKyc.create({
            data: {
                tenantId: input.tenantId,
                riderProfileId: rider.id,
                status: 'SUBMITTED',
                submittedAt: new Date(),
            },
        });
    }
    async getProfileForUser(tenantId, userId, riderProfileId) {
        const riderProfile = await this.prisma.riderProfile.findFirst({
            where: {
                tenantId,
                userId,
                ...(riderProfileId ? { id: riderProfileId } : {}),
            },
        });
        if (!riderProfile) {
            throw new ForbiddenException('RIDER_PROFILE_NOT_FOUND');
        }
        return riderProfile;
    }
    async getRiderStatus(tenantId, userId) {
        const rider = await this.getProfileForUser(tenantId, userId);
        return {
            riderProfileId: rider.id,
            riderCode: rider.riderCode,
            riderState: rider.riderState,
            onboardingStatus: rider.onboardingStatus,
            preferredHubId: rider.preferredHubId,
            primaryHubId: rider.primaryHubId,
            serviceArea: rider.serviceArea,
        };
    }
    async getAssignedHubs(tenantId, userId) {
        const rider = await this.getProfileForUser(tenantId, userId);
        return this.prisma.riderHubAssignment.findMany({
            where: { tenantId, riderProfileId: rider.id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async selectPreferredHub(tenantId, userId, hubId) {
        if (!hubId) {
            throw new BadRequestException('HUB_REQUIRED');
        }
        const rider = await this.getProfileForUser(tenantId, userId);
        return this.prisma.riderProfile.update({
            where: { id: rider.id },
            data: {
                preferredHubId: hubId,
                primaryHubId: rider.primaryHubId ?? hubId,
            },
        });
    }
    async getDashboard(tenantId, userId) {
        const rider = await this.getProfileForUser(tenantId, userId);
        const kyc = await this.prisma.riderKyc.findFirst({
            where: { tenantId, riderProfileId: rider.id },
            include: { documents: true },
        });
        const activeVehicle = await this.prisma.vehicle.findFirst({
            where: { tenantId, riderProfileId: rider.id, status: 'ACTIVE' },
        });
        const slots = await this.prisma.riderSlot.findMany({
            where: { tenantId, riderProfileId: rider.id },
            orderBy: { date: 'asc' },
            take: 10,
        });
        const checkIn = await this.prisma.hubCheckIn.findFirst({
            where: { tenantId, riderProfileId: rider.id },
            orderBy: { checkedInAt: 'desc' },
        });
        return {
            identity: {
                riderCode: rider.riderCode,
                name: 'Rider',
                status: rider.riderState,
            },
            workforce: {
                primaryHub: rider.primaryHubId,
                activeVehicle: activeVehicle ? { id: activeVehicle.id, status: activeVehicle.status } : null,
                todaysSlots: slots,
                checkInStatus: checkIn ? { status: checkIn.result, checkedInAt: checkIn.checkedInAt } : { status: 'NOT_CHECKED_IN' },
                eligibility: { eligible: true, reasons: [] },
            },
            onboarding: {
                kycStatus: kyc?.status ?? 'DRAFT',
                activationStatus: 'PENDING',
                welcomeKit: null,
            },
            notifications: {
                unreadCount: 0,
                recent: [],
            },
        };
    }
    async getKycForRider(tenantId, userId) {
        const rider = await this.getProfileForUser(tenantId, userId);
        return this.prisma.riderKyc.findFirst({
            where: { tenantId, riderProfileId: rider.id },
            include: { documents: true },
        });
    }
    async addKycDocument(tenantId, userId, body) {
        const rider = await this.getProfileForUser(tenantId, userId);
        const existingKyc = await this.prisma.riderKyc.findFirst({
            where: { tenantId, riderProfileId: rider.id },
        });
        const kyc = existingKyc
            ? await this.prisma.riderKyc.update({
                where: { id: existingKyc.id },
                data: { status: 'SUBMITTED' },
            })
            : await this.prisma.riderKyc.create({
                data: {
                    tenantId,
                    riderProfileId: rider.id,
                    status: 'SUBMITTED',
                },
            });
        return this.prisma.kycDocument.create({
            data: {
                tenantId,
                riderKycId: kyc.id,
                documentType: body.documentType,
                documentRef: body.documentRef ?? null,
                status: 'PENDING',
            },
        });
    }
    async getKycDocuments(tenantId, userId) {
        const rider = await this.getProfileForUser(tenantId, userId);
        const kyc = await this.prisma.riderKyc.findFirst({
            where: { tenantId, riderProfileId: rider.id },
        });
        if (!kyc)
            return [];
        return this.prisma.kycDocument.findMany({
            where: { tenantId, riderKycId: kyc.id },
        });
    }
    async getKycStatus(tenantId, userId) {
        const rider = await this.getProfileForUser(tenantId, userId);
        const kyc = await this.prisma.riderKyc.findFirst({
            where: { tenantId, riderProfileId: rider.id },
        });
        return {
            status: kyc?.status ?? 'DRAFT',
            requiredDocuments: ['ID_PROOF', 'ADDRESS_PROOF'],
            verifiedDocuments: kyc
                ? await this.prisma.kycDocument.count({
                    where: { tenantId, riderKycId: kyc.id, status: 'VERIFIED' },
                })
                : 0,
        };
    }
    async generateActivationPin(tenantId, hubId, userRole, riderId) {
        await this.assertTenantRole(userRole, ['ADMIN', 'HUB_MANAGER', 'HUB_STAFF', 'OPERATIONS_MANAGER']);
        const riderProfile = await this.prisma.riderProfile.findFirst({
            where: { tenantId, id: riderId },
        });
        if (!riderProfile)
            throw new NotFoundException('RIDER_NOT_FOUND');
        if (hubId && riderProfile.primaryHubId && riderProfile.primaryHubId !== hubId) {
            throw new ForbiddenException('WRONG_HUB');
        }
        const pin = `${Math.floor(100000 + Math.random() * 900000)}`;
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        const hash = await bcrypt.hash(pin, 12);
        const activationPinApi = this.prisma.activationPin;
        if (typeof activationPinApi.updateMany === 'function') {
            await activationPinApi.updateMany({
                where: { tenantId, riderProfileId: riderProfile.id, status: 'ACTIVE' },
                data: { status: 'REVOKED' },
            });
        }
        return activationPinApi.create({
            data: {
                tenantId,
                riderProfileId: riderProfile.id,
                hash,
                expiresAt,
                status: 'ACTIVE',
                attempts: 0,
                maxAttempts: 5,
            },
        });
    }
    async activateRider(tenantId, userId, pin) {
        const rider = await this.getProfileForUser(tenantId, userId);
        if (!pin) {
            throw new BadRequestException('ACTIVATION_PIN_REQUIRED');
        }
        const pinRecord = await this.prisma.activationPin.findFirst({
            where: { tenantId, riderProfileId: rider.id },
            orderBy: { createdAt: 'desc' },
        });
        if (!pinRecord) {
            throw new BadRequestException('ACTIVATION_PIN_INVALID');
        }
        const matches = await bcrypt.compare(pin, pinRecord.hash);
        if (!matches) {
            const attempts = Number(pinRecord.attempts ?? 0) + 1;
            const shouldLock = attempts >= Number(pinRecord.maxAttempts ?? 5);
            if (typeof this.prisma.activationPin.update === 'function') {
                await this.prisma.activationPin.update({
                    where: { id: pinRecord.id },
                    data: { attempts, status: shouldLock ? 'LOCKED' : 'ACTIVE' },
                });
            }
            if (shouldLock) {
                throw new BadRequestException('ACTIVATION_PIN_LOCKED');
            }
            throw new BadRequestException('ACTIVATION_PIN_INVALID');
        }
        if (new Date(pinRecord.expiresAt).getTime() <= Date.now()) {
            if (typeof this.prisma.activationPin.update === 'function') {
                await this.prisma.activationPin.update({
                    where: { id: pinRecord.id },
                    data: { status: 'EXPIRED' },
                });
            }
            throw new BadRequestException('ACTIVATION_PIN_EXPIRED');
        }
        if (typeof this.prisma.activationPin.update === 'function') {
            await this.prisma.activationPin.update({
                where: { id: pinRecord.id },
                data: { status: 'USED', attempts: Number(pinRecord.attempts ?? 0) + 1 },
            });
        }
        return { riderProfileId: rider.id, activated: true, activationStatus: 'VERIFIED' };
    }
    async resendActivationPin(tenantId, hubId, userRole, riderId) {
        await this.assertTenantRole(userRole, ['ADMIN', 'HUB_MANAGER', 'HUB_STAFF', 'OPERATIONS_MANAGER']);
        return this.generateActivationPin(tenantId, hubId, userRole, riderId);
    }
    async getActivationStatus(tenantId, userId) {
        const rider = await this.getProfileForUser(tenantId, userId);
        const pin = await this.prisma.activationPin.findFirst({
            where: { tenantId, riderProfileId: rider.id },
            orderBy: { createdAt: 'desc' },
        });
        return {
            riderProfileId: rider.id,
            hasActivationPin: !!pin,
            status: pin ? 'PENDING' : 'NOT_REQUESTED',
        };
    }
    async getWelcomeKit(tenantId, userId) {
        const rider = await this.getProfileForUser(tenantId, userId);
        return this.prisma.welcomeKit.findFirst({
            where: { tenantId, riderProfileId: rider.id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createWelcomeKit(tenantId, hubId, userRole, riderId, body) {
        await this.assertTenantRole(userRole, ['ADMIN', 'HUB_MANAGER', 'HUB_STAFF', 'OPERATIONS_MANAGER']);
        const rider = await this.prisma.riderProfile.findFirst({ where: { tenantId, id: riderId } });
        if (!rider)
            throw new NotFoundException('RIDER_NOT_FOUND');
        return this.prisma.welcomeKit.create({
            data: {
                tenantId,
                riderProfileId: rider.id,
                orderRef: body.orderRef ?? `WK-${Date.now()}`,
                status: 'ORDERED',
                items: body.items ?? [],
                trackingCode: body.trackingCode ?? null,
                courierProvider: body.courierProvider ?? null,
            },
        });
    }
    async updateWelcomeKitStatus(tenantId, hubId, userRole, id, status, trackingReference, notes) {
        await this.assertTenantRole(userRole, ['ADMIN', 'HUB_MANAGER', 'HUB_STAFF', 'OPERATIONS_MANAGER']);
        return this.prisma.welcomeKit.update({
            where: { id },
            data: {
                status: status,
                trackingCode: trackingReference ?? undefined,
                dispatchStatus: notes ?? undefined,
            },
        });
    }
    async getVehiclesForRider(tenantId, userId) {
        const rider = await this.getProfileForUser(tenantId, userId);
        return this.prisma.vehicle.findMany({ where: { tenantId, riderProfileId: rider.id } });
    }
    async createVehicle(tenantId, userId, body) {
        const rider = await this.getProfileForUser(tenantId, userId);
        return this.prisma.vehicle.create({
            data: {
                tenantId,
                riderProfileId: rider.id,
                type: body.type,
                registration: body.registration,
                vehicleType: body.vehicleType,
                make: body.make,
                model: body.model,
                year: body.year,
                fuelType: body.fuelType,
                capacity: body.capacity,
                status: 'PENDING_VERIFICATION',
            },
        });
    }
    async getVehicle(tenantId, userId, id) {
        const rider = await this.getProfileForUser(tenantId, userId);
        return this.prisma.vehicle.findFirst({ where: { tenantId, riderProfileId: rider.id, id } });
    }
    async submitVehicleDocuments(tenantId, userId, id, body) {
        const rider = await this.getProfileForUser(tenantId, userId);
        return this.prisma.vehicle.update({
            where: { id, tenantId, riderProfileId: rider.id },
            data: {
                rcReference: body.rcReference ?? undefined,
                insuranceReference: body.insuranceReference ?? undefined,
                permitReference: body.permitReference ?? undefined,
                verificationState: 'PENDING',
            },
        });
    }
    async verifyVehicle(tenantId, hubId, userRole, id, notes) {
        await this.assertTenantRole(userRole, ['ADMIN', 'HUB_MANAGER', 'HUB_STAFF', 'OPERATIONS_MANAGER']);
        return this.prisma.vehicle.update({
            where: { id, tenantId },
            data: { status: 'ACTIVE', verificationState: 'VERIFIED' },
        });
    }
    async rejectVehicle(tenantId, hubId, userRole, id, notes) {
        await this.assertTenantRole(userRole, ['ADMIN', 'HUB_MANAGER', 'HUB_STAFF', 'OPERATIONS_MANAGER']);
        return this.prisma.vehicle.update({
            where: { id, tenantId },
            data: { status: 'SUSPENDED', verificationState: 'REJECTED' },
        });
    }
    async getAvailableSlots(tenantId, userId) {
        const rider = await this.getProfileForUser(tenantId, userId);
        return this.prisma.riderSlot.findMany({
            where: { tenantId, riderProfileId: rider.id, status: 'AVAILABLE' },
        });
    }
    async bookSlot(tenantId, userId, body) {
        const rider = await this.getProfileForUser(tenantId, userId);
        const start = this.parseDate(body.startTime);
        const end = this.parseDate(body.endTime);
        const date = this.parseDate(body.date);
        if (!date || !start || !end) {
            throw new BadRequestException('INVALID_SLOT_TIME');
        }
        if (start.getTime() <= Date.now()) {
            throw new BadRequestException('SLOT_MUST_BE_IN_FUTURE');
        }
        const requestedCapacity = Math.max(1, Number(body.capacity ?? 1));
        return this.prisma.$transaction(async (tx) => {
            await tx.$queryRawUnsafe `SELECT pg_advisory_xact_lock(hashtext(${tenantId}), hashtext(${body.hubId}))`;
            const overlappingSlots = await tx.riderSlot.findMany({
                where: {
                    tenantId,
                    hubId: body.hubId,
                    status: { not: 'CANCELLED' },
                    startTime: { lt: end },
                    endTime: { gt: start },
                },
            });
            if (overlappingSlots.length > 0) {
                throw new BadRequestException('DUPLICATE_SLOT');
            }
            return tx.riderSlot.create({
                data: {
                    tenantId,
                    riderProfileId: rider.id,
                    hubId: body.hubId,
                    date,
                    startTime: start,
                    endTime: end,
                    status: 'BOOKED',
                    capacity: requestedCapacity,
                    bookedCount: requestedCapacity,
                },
            });
        });
    }
    async bookMultipleSlots(tenantId, userId, requests) {
        const rider = await this.getProfileForUser(tenantId, userId);
        return this.prisma.$transaction(async (tx) => {
            const results = [];
            for (const request of requests) {
                const start = this.parseDate(request.startTime);
                const end = this.parseDate(request.endTime);
                if (!start || !end) {
                    throw new BadRequestException('INVALID_SLOT_TIME');
                }
                const requestedCapacity = Math.max(1, Number(request.capacity ?? 1));
                await tx.$queryRawUnsafe `SELECT pg_advisory_xact_lock(hashtext(${tenantId}), hashtext(${request.hubId}))`;
                const overlappingSlots = await tx.riderSlot.findMany({
                    where: {
                        tenantId,
                        hubId: request.hubId,
                        status: { not: 'CANCELLED' },
                        startTime: { lt: end },
                        endTime: { gt: start },
                    },
                });
                if (overlappingSlots.length > 0) {
                    throw new BadRequestException('DUPLICATE_SLOT');
                }
                const created = await tx.riderSlot.create({
                    data: {
                        tenantId,
                        riderProfileId: rider.id,
                        hubId: request.hubId,
                        date: new Date(request.date),
                        startTime: start,
                        endTime: end,
                        status: 'BOOKED',
                        capacity: requestedCapacity,
                        bookedCount: requestedCapacity,
                    },
                });
                results.push(created);
            }
            return results;
        });
    }
    async getSlotsForRider(tenantId, userId) {
        const rider = await this.getProfileForUser(tenantId, userId);
        return this.prisma.riderSlot.findMany({ where: { tenantId, riderProfileId: rider.id } });
    }
    async getPendingKycForHub(tenantId, hubId, userRole) {
        await this.assertTenantRole(userRole, ['ADMIN', 'HUB_MANAGER', 'HUB_STAFF']);
        return this.prisma.riderKyc.findMany({
            where: { tenantId, status: 'SUBMITTED' },
            include: { riderProfile: true },
        });
    }
    async getHubRiderKyc(tenantId, hubId, userRole, riderId) {
        await this.assertTenantRole(userRole, ['ADMIN', 'HUB_MANAGER', 'HUB_STAFF']);
        return this.prisma.riderKyc.findFirst({
            where: { tenantId, riderProfileId: riderId },
            include: { documents: true },
        });
    }
    async verifyKycDocument(tenantId, hubId, userRole, riderId, documentId, verifierId, notes) {
        await this.assertTenantRole(userRole, ['ADMIN', 'HUB_MANAGER', 'HUB_STAFF']);
        const kyc = await this.prisma.riderKyc.findFirst({
            where: { tenantId, riderProfileId: riderId },
        });
        if (!kyc)
            throw new NotFoundException('KYC_NOT_FOUND');
        if (kyc.status === 'VERIFIED' || kyc.status === 'REJECTED') {
            throw new BadRequestException('KYC_ALREADY_FINALIZED');
        }
        const document = await this.prisma.kycDocument.findFirst({
            where: { id: documentId, tenantId, riderKycId: kyc.id },
        });
        if (!document)
            throw new NotFoundException('DOCUMENT_NOT_FOUND');
        const verification = await this.prisma.documentVerification.create({
            data: {
                tenantId,
                riderKycId: kyc.id,
                documentId,
                documentType: document.documentType,
                hubId: hubId ?? null,
                verifierId: verifierId ?? null,
                result: 'VERIFIED',
                notes: notes ?? null,
                verifiedAt: new Date(),
            },
        });
        await this.prisma.kycDocument.update({
            where: { id: documentId, tenantId },
            data: { status: 'VERIFIED', verifiedAt: new Date(), rejectionReason: null },
        });
        return verification;
    }
    async rejectKycDocument(tenantId, hubId, userRole, riderId, documentId, verifierId, notes) {
        await this.assertTenantRole(userRole, ['ADMIN', 'HUB_MANAGER', 'HUB_STAFF']);
        const kyc = await this.prisma.riderKyc.findFirst({
            where: { tenantId, riderProfileId: riderId },
        });
        if (!kyc)
            throw new NotFoundException('KYC_NOT_FOUND');
        const document = await this.prisma.kycDocument.findFirst({
            where: { id: documentId, tenantId, riderKycId: kyc.id },
        });
        if (!document)
            throw new NotFoundException('DOCUMENT_NOT_FOUND');
        const verification = await this.prisma.documentVerification.create({
            data: {
                tenantId,
                riderKycId: kyc.id,
                documentId,
                documentType: document.documentType,
                hubId: hubId ?? null,
                verifierId: verifierId ?? null,
                result: 'REJECTED',
                notes: notes ?? null,
                verifiedAt: new Date(),
            },
        });
        await this.prisma.kycDocument.update({
            where: { id: documentId, tenantId },
            data: { status: 'REJECTED', rejectedAt: new Date(), rejectionReason: notes ?? null },
        });
        return verification;
    }
    async approveKyc(tenantId, hubId, userRole, riderId, reviewerId, notes) {
        await this.assertTenantRole(userRole, ['ADMIN', 'HUB_MANAGER', 'HUB_STAFF']);
        const kyc = await this.prisma.riderKyc.findFirst({
            where: { tenantId, riderProfileId: riderId },
            include: { documents: true },
        });
        if (!kyc)
            throw new NotFoundException('KYC_NOT_FOUND');
        if (!this.validateKycTransition(kyc.status, 'VERIFIED')) {
            throw new BadRequestException(`INVALID_KYC_TRANSITION: ${kyc.status} -> VERIFIED`);
        }
        const unverifiedDocs = kyc.documents.filter(d => d.status !== 'VERIFIED');
        if (unverifiedDocs.length > 0) {
            throw new BadRequestException('PENDING_DOCUMENT_VERIFICATION');
        }
        return this.prisma.riderKyc.update({
            where: { tenantId_riderProfileId: { tenantId, riderProfileId: riderId } },
            data: {
                status: 'VERIFIED',
                verifiedAt: new Date(),
                reviewerId: reviewerId ?? null,
                reviewNotes: notes ?? null,
            },
        });
    }
    async rejectKyc(tenantId, hubId, userRole, riderId, reviewerId, notes) {
        await this.assertTenantRole(userRole, ['ADMIN', 'HUB_MANAGER', 'HUB_STAFF']);
        const kyc = await this.prisma.riderKyc.findFirst({
            where: { tenantId, riderProfileId: riderId },
        });
        if (!kyc)
            throw new NotFoundException('KYC_NOT_FOUND');
        if (!this.validateKycTransition(kyc.status, 'REJECTED')) {
            throw new BadRequestException(`INVALID_KYC_TRANSITION: ${kyc.status} -> REJECTED`);
        }
        return this.prisma.riderKyc.update({
            where: { tenantId_riderProfileId: { tenantId, riderProfileId: riderId } },
            data: {
                status: 'REJECTED',
                rejectedAt: new Date(),
                rejectionReason: notes ?? null,
                reviewerId: reviewerId ?? null,
            },
        });
    }
    async checkInRider(input) {
        const riderProfile = await this.resolveOwnedRiderProfile({
            tenantId: input.tenantId,
            userId: input.userId,
            riderProfileId: input.riderProfileId,
        });
        const active = await this.prisma.hubCheckIn.findFirst({
            where: {
                tenantId: input.tenantId,
                riderProfileId: riderProfile.id,
                slotId: input.slotId,
                result: 'CHECKED_IN',
            },
        });
        if (active) {
            return { result: 'ALREADY_CHECKED_IN', checkIn: active };
        }
        const checkIn = await this.prisma.hubCheckIn.create({
            data: {
                tenantId: input.tenantId,
                riderProfileId: riderProfile.id,
                hubId: input.hubId,
                slotId: input.slotId,
                lat: input.lat,
                lng: input.lng,
                gpsAccuracy: input.gpsAccuracy,
                deviceId: input.deviceId,
                result: 'CHECKED_IN',
            },
        });
        return { result: 'CHECKED_IN', checkIn };
    }
    async checkOutRider(tenantId, userId, body) {
        const rider = await this.getProfileForUser(tenantId, userId);
        const checkIn = await this.prisma.hubCheckIn.findFirst({
            where: { tenantId, riderProfileId: rider.id, result: 'CHECKED_IN' },
            orderBy: { checkedInAt: 'desc' },
        });
        if (!checkIn)
            throw new BadRequestException('INVALID_CHECKIN');
        return this.prisma.hubCheckIn.update({
            where: { id: checkIn.id },
            data: { result: 'CHECKED_OUT' },
        });
    }
    async getCheckInStatus(tenantId, userId) {
        const rider = await this.getProfileForUser(tenantId, userId);
        const checkIn = await this.prisma.hubCheckIn.findFirst({
            where: { tenantId, riderProfileId: rider.id },
            orderBy: { checkedInAt: 'desc' },
        });
        return { status: checkIn?.result ?? 'NOT_CHECKED_IN', checkedInAt: checkIn?.checkedInAt ?? null };
    }
};
RiderWorkforceService = RiderWorkforceService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], RiderWorkforceService);
export { RiderWorkforceService };
//# sourceMappingURL=rider-workforce.service.js.map