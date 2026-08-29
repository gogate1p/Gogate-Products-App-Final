import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { RiderWorkforceService } from './rider-workforce.service.js';

@UseGuards(AuthGuard)
@Controller('workforce')
export class WorkforceController {
  constructor(private readonly riderWorkforceService: RiderWorkforceService) {}

  private getAuthenticatedUser(req: any) {
    const user = req?.user ?? req?.auth ?? req?.session?.user;
    if (!user?.id || !user?.tenantId) {
      throw new ForbiddenException('UNAUTHENTICATED_USER');
    }
    return user;
  }

  @Post('riders/signup')
  async signupRider(@Body() body: any) {
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

  @Get('riders/me')
  async getMyProfile(@Req() req: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getProfileForUser(user.tenantId, user.id);
  }

  @Get('riders/me/status')
  async getMyStatus(@Req() req: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getRiderStatus(user.tenantId, user.id);
  }

  @Get('riders/me/hubs')
  async getMyHubs(@Req() req: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getAssignedHubs(user.tenantId, user.id);
  }

  @Post('riders/me/hub-selection')
  async selectPreferredHub(@Req() req: any, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.selectPreferredHub(user.tenantId, user.id, body.hubId);
  }

  @Get('riders/me/dashboard')
  async getDashboard(@Req() req: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getDashboard(user.tenantId, user.id);
  }

  @Post('riders/me/kyc')
  async submitKyc(@Req() req: any, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.submitKyc({
      tenantId: user.tenantId,
      riderProfileId: body.riderProfileId ?? user.riderProfileId,
      userId: user.id,
    });
  }

  @Get('riders/me/kyc')
  async getMyKyc(@Req() req: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getKycForRider(user.tenantId, user.id);
  }

  @Post('riders/me/kyc/documents')
  async addKycDocument(@Req() req: any, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.addKycDocument(user.tenantId, user.id, body);
  }

  @Get('riders/me/kyc/documents')
  async getKycDocuments(@Req() req: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getKycDocuments(user.tenantId, user.id);
  }

  @Get('riders/me/kyc/status')
  async getKycStatus(@Req() req: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getKycStatus(user.tenantId, user.id);
  }

  @Post('riders/me/activate')
  async activateRider(@Req() req: any, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.activateRider(user.tenantId, user.id, body.pin);
  }

  @Get('riders/me/activation-status')
  async getActivationStatus(@Req() req: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getActivationStatus(user.tenantId, user.id);
  }

  @Get('riders/me/welcome-kit')
  async getWelcomeKit(@Req() req: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getWelcomeKit(user.tenantId, user.id);
  }

  @Get('riders/me/vehicles')
  async getMyVehicles(@Req() req: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getVehiclesForRider(user.tenantId, user.id);
  }

  @Post('riders/me/vehicles')
  async createVehicle(@Req() req: any, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.createVehicle(user.tenantId, user.id, body);
  }

  @Get('riders/me/vehicles/:id')
  async getVehicle(@Req() req: any, @Param('id') id: string) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getVehicle(user.tenantId, user.id, id);
  }

  @Post('riders/me/vehicles/:id/submit')
  async submitVehicle(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.submitVehicleDocuments(user.tenantId, user.id, id, body);
  }

  @Get('riders/me/slots/available')
  async getAvailableSlots(@Req() req: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getAvailableSlots(user.tenantId, user.id);
  }

  @Post('riders/me/slots/book')
  async bookSlot(@Req() req: any, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.bookSlot(user.tenantId, user.id, body);
  }

  @Post('riders/me/slots/book-multiple')
  async bookMultipleSlots(@Req() req: any, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.bookMultipleSlots(user.tenantId, user.id, body.requests ?? []);
  }

  @Get('riders/me/slots')
  async getMySlots(@Req() req: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getSlotsForRider(user.tenantId, user.id);
  }

  @Post('riders/me/check-in')
  async checkIn(@Req() req: any, @Body() body: any) {
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

  @Post('riders/me/check-out')
  async checkOut(@Req() req: any, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.checkOutRider(user.tenantId, user.id, body);
  }

  @Get('riders/me/check-in-status')
  async getCheckInStatus(@Req() req: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getCheckInStatus(user.tenantId, user.id);
  }

  @Get('riders/:id')
  async getProfileForId(@Req() req: any, @Param('id') id: string) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getProfileForUser(user.tenantId, user.id, id);
  }

  @Get('hub/kyc/pending')
  async getPendingKyc(@Req() req: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getPendingKycForHub(user.tenantId, user.hubId, user.role);
  }

  @Get('hub/riders/:riderId/kyc')
  async getHubRiderKyc(@Req() req: any, @Param('riderId') riderId: string) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.getHubRiderKyc(user.tenantId, user.hubId, user.role, riderId);
  }

  @Post('hub/riders/:riderId/documents/:documentId/verify')
  async verifyHubDocument(@Req() req: any, @Param('riderId') riderId: string, @Param('documentId') documentId: string, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.verifyKycDocument(user.tenantId, user.hubId, user.role, riderId, documentId, body.notes);
  }

  @Post('hub/riders/:riderId/documents/:documentId/reject')
  async rejectHubDocument(@Req() req: any, @Param('riderId') riderId: string, @Param('documentId') documentId: string, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.rejectKycDocument(user.tenantId, user.hubId, user.role, riderId, documentId, body.notes);
  }

  @Post('hub/riders/:riderId/kyc/approve')
  async approveHubKyc(@Req() req: any, @Param('riderId') riderId: string, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.approveKyc(user.tenantId, user.hubId, user.role, riderId, body.notes);
  }

  @Post('hub/riders/:riderId/kyc/reject')
  async rejectHubKyc(@Req() req: any, @Param('riderId') riderId: string, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.rejectKyc(user.tenantId, user.hubId, user.role, riderId, body.notes);
  }

  @Post('hub/riders/:riderId/activation-pin')
  async generateActivationPin(@Req() req: any, @Param('riderId') riderId: string) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.generateActivationPin(user.tenantId, user.hubId, user.role, riderId);
  }

  @Post('hub/riders/:riderId/activation-pin/resend')
  async resendActivationPin(@Req() req: any, @Param('riderId') riderId: string) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.resendActivationPin(user.tenantId, user.hubId, user.role, riderId);
  }

  @Post('hub/riders/:riderId/welcome-kit')
  async createWelcomeKit(@Req() req: any, @Param('riderId') riderId: string, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.createWelcomeKit(user.tenantId, user.hubId, user.role, riderId, body);
  }

  @Patch('hub/welcome-kits/:id/status')
  async updateWelcomeKitStatus(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.updateWelcomeKitStatus(user.tenantId, user.hubId, user.role, id, body.status, body.trackingReference, body.notes);
  }

  @Post('hub/vehicles/:id/verify')
  async verifyVehicle(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.verifyVehicle(user.tenantId, user.hubId, user.role, id, body.notes);
  }

  @Post('hub/vehicles/:id/reject')
  async rejectVehicle(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    const user = this.getAuthenticatedUser(req);
    return this.riderWorkforceService.rejectVehicle(user.tenantId, user.hubId, user.role, id, body.notes);
  }
}
