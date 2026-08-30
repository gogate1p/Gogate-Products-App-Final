var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { RiderWorkforceService } from './rider-workforce.service.js';
let WorkforceController = class WorkforceController {
    riderWorkforceService;
    constructor(riderWorkforceService) {
        this.riderWorkforceService = riderWorkforceService;
    }
    getAuthenticatedUser(req) {
        const user = req?.user ?? req?.auth ?? req?.session?.user;
        if (!user?.id || !user?.tenantId) {
            throw new ForbiddenException('UNAUTHENTICATED_USER');
        }
        return user;
    }
    async signupRider(body) {
        return this.riderWorkforceService.signupRider({
            tenantId: body.tenantId,
            name: body.name,
            email: body.email,
            phone: body.phone,
            passwordHash: body.passwordHash,
            preferredHubId: body.preferredHubId,
            serviceArea: body.serviceArea,
        });
    }
    async getMyProfile(req) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getProfileForUser(user.tenantId, user.id);
    }
    async getMyStatus(req) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getRiderStatus(user.tenantId, user.id);
    }
    async getMyHubs(req) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getAssignedHubs(user.tenantId, user.id);
    }
    async selectPreferredHub(req, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.selectPreferredHub(user.tenantId, user.id, body.hubId);
    }
    async getDashboard(req) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getDashboard(user.tenantId, user.id);
    }
    async submitKyc(req, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.submitKyc({
            tenantId: user.tenantId,
            riderProfileId: body.riderProfileId ?? user.riderProfileId,
            userId: user.id,
        });
    }
    async getMyKyc(req) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getKycForRider(user.tenantId, user.id);
    }
    async addKycDocument(req, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.addKycDocument(user.tenantId, user.id, body);
    }
    async getKycDocuments(req) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getKycDocuments(user.tenantId, user.id);
    }
    async getKycStatus(req) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getKycStatus(user.tenantId, user.id);
    }
    async activateRider(req, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.activateRider(user.tenantId, user.id, body.pin);
    }
    async getActivationStatus(req) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getActivationStatus(user.tenantId, user.id);
    }
    async getWelcomeKit(req) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getWelcomeKit(user.tenantId, user.id);
    }
    async getMyVehicles(req) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getVehiclesForRider(user.tenantId, user.id);
    }
    async createVehicle(req, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.createVehicle(user.tenantId, user.id, body);
    }
    async getVehicle(req, id) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getVehicle(user.tenantId, user.id, id);
    }
    async submitVehicle(req, id, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.submitVehicleDocuments(user.tenantId, user.id, id, body);
    }
    async getAvailableSlots(req) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getAvailableSlots(user.tenantId, user.id);
    }
    async bookSlot(req, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.bookSlot(user.tenantId, user.id, body);
    }
    async bookMultipleSlots(req, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.bookMultipleSlots(user.tenantId, user.id, body.requests ?? []);
    }
    async getMySlots(req) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getSlotsForRider(user.tenantId, user.id);
    }
    async checkIn(req, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.checkInRider({
            tenantId: user.tenantId,
            riderProfileId: body.riderProfileId ?? user.riderProfileId,
            userId: user.id,
            hubId: body.hubId,
            slotId: body.slotId,
            lat: Number(body.lat),
            lng: Number(body.lng),
            gpsAccuracy: Number(body.gpsAccuracy ?? 0),
            deviceId: body.deviceId,
            idempotencyKey: body.idempotencyKey,
        });
    }
    async checkOut(req, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.checkOutRider(user.tenantId, user.id, body);
    }
    async getCheckInStatus(req) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getCheckInStatus(user.tenantId, user.id);
    }
    async getProfileForId(req, id) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getProfileForUser(user.tenantId, user.id, id);
    }
    async getPendingKyc(req) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getPendingKycForHub(user.tenantId, user.hubId, user.role);
    }
    async getHubRiderKyc(req, riderId) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.getHubRiderKyc(user.tenantId, user.hubId, user.role, riderId);
    }
    async verifyHubDocument(req, riderId, documentId, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.verifyKycDocument(user.tenantId, user.hubId, user.role, riderId, documentId, body.notes);
    }
    async rejectHubDocument(req, riderId, documentId, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.rejectKycDocument(user.tenantId, user.hubId, user.role, riderId, documentId, body.notes);
    }
    async approveHubKyc(req, riderId, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.approveKyc(user.tenantId, user.hubId, user.role, riderId, body.notes);
    }
    async rejectHubKyc(req, riderId, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.rejectKyc(user.tenantId, user.hubId, user.role, riderId, body.notes);
    }
    async generateActivationPin(req, riderId) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.generateActivationPin(user.tenantId, user.hubId, user.role, riderId);
    }
    async resendActivationPin(req, riderId) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.resendActivationPin(user.tenantId, user.hubId, user.role, riderId);
    }
    async createWelcomeKit(req, riderId, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.createWelcomeKit(user.tenantId, user.hubId, user.role, riderId, body);
    }
    async updateWelcomeKitStatus(req, id, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.updateWelcomeKitStatus(user.tenantId, user.hubId, user.role, id, body.status, body.trackingReference, body.notes);
    }
    async verifyVehicle(req, id, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.verifyVehicle(user.tenantId, user.hubId, user.role, id, body.notes);
    }
    async rejectVehicle(req, id, body) {
        const user = this.getAuthenticatedUser(req);
        return this.riderWorkforceService.rejectVehicle(user.tenantId, user.hubId, user.role, id, body.notes);
    }
};
__decorate([
    Post('riders/signup'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "signupRider", null);
__decorate([
    Get('riders/me'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getMyProfile", null);
__decorate([
    Get('riders/me/status'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getMyStatus", null);
__decorate([
    Get('riders/me/hubs'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getMyHubs", null);
__decorate([
    Post('riders/me/hub-selection'),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "selectPreferredHub", null);
__decorate([
    Get('riders/me/dashboard'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getDashboard", null);
__decorate([
    Post('riders/me/kyc'),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "submitKyc", null);
__decorate([
    Get('riders/me/kyc'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getMyKyc", null);
__decorate([
    Post('riders/me/kyc/documents'),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "addKycDocument", null);
__decorate([
    Get('riders/me/kyc/documents'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getKycDocuments", null);
__decorate([
    Get('riders/me/kyc/status'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getKycStatus", null);
__decorate([
    Post('riders/me/activate'),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "activateRider", null);
__decorate([
    Get('riders/me/activation-status'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getActivationStatus", null);
__decorate([
    Get('riders/me/welcome-kit'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getWelcomeKit", null);
__decorate([
    Get('riders/me/vehicles'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getMyVehicles", null);
__decorate([
    Post('riders/me/vehicles'),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "createVehicle", null);
__decorate([
    Get('riders/me/vehicles/:id'),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getVehicle", null);
__decorate([
    Post('riders/me/vehicles/:id/submit'),
    __param(0, Req()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "submitVehicle", null);
__decorate([
    Get('riders/me/slots/available'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getAvailableSlots", null);
__decorate([
    Post('riders/me/slots/book'),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "bookSlot", null);
__decorate([
    Post('riders/me/slots/book-multiple'),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "bookMultipleSlots", null);
__decorate([
    Get('riders/me/slots'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getMySlots", null);
__decorate([
    Post('riders/me/check-in'),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "checkIn", null);
__decorate([
    Post('riders/me/check-out'),
    __param(0, Req()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "checkOut", null);
__decorate([
    Get('riders/me/check-in-status'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getCheckInStatus", null);
__decorate([
    Get('riders/:id'),
    __param(0, Req()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getProfileForId", null);
__decorate([
    Get('hub/kyc/pending'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getPendingKyc", null);
__decorate([
    Get('hub/riders/:riderId/kyc'),
    __param(0, Req()),
    __param(1, Param('riderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "getHubRiderKyc", null);
__decorate([
    Post('hub/riders/:riderId/documents/:documentId/verify'),
    __param(0, Req()),
    __param(1, Param('riderId')),
    __param(2, Param('documentId')),
    __param(3, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "verifyHubDocument", null);
__decorate([
    Post('hub/riders/:riderId/documents/:documentId/reject'),
    __param(0, Req()),
    __param(1, Param('riderId')),
    __param(2, Param('documentId')),
    __param(3, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "rejectHubDocument", null);
__decorate([
    Post('hub/riders/:riderId/kyc/approve'),
    __param(0, Req()),
    __param(1, Param('riderId')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "approveHubKyc", null);
__decorate([
    Post('hub/riders/:riderId/kyc/reject'),
    __param(0, Req()),
    __param(1, Param('riderId')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "rejectHubKyc", null);
__decorate([
    Post('hub/riders/:riderId/activation-pin'),
    __param(0, Req()),
    __param(1, Param('riderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "generateActivationPin", null);
__decorate([
    Post('hub/riders/:riderId/activation-pin/resend'),
    __param(0, Req()),
    __param(1, Param('riderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "resendActivationPin", null);
__decorate([
    Post('hub/riders/:riderId/welcome-kit'),
    __param(0, Req()),
    __param(1, Param('riderId')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "createWelcomeKit", null);
__decorate([
    Patch('hub/welcome-kits/:id/status'),
    __param(0, Req()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "updateWelcomeKitStatus", null);
__decorate([
    Post('hub/vehicles/:id/verify'),
    __param(0, Req()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "verifyVehicle", null);
__decorate([
    Post('hub/vehicles/:id/reject'),
    __param(0, Req()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], WorkforceController.prototype, "rejectVehicle", null);
WorkforceController = __decorate([
    UseGuards(AuthGuard),
    Controller('workforce'),
    __metadata("design:paramtypes", [RiderWorkforceService])
], WorkforceController);
export { WorkforceController };
//# sourceMappingURL=workforce.controller.js.map