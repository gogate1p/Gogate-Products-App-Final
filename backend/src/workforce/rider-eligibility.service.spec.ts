import { RiderEligibilityService } from './rider-eligibility.service.js';

describe('RiderEligibilityService', () => {
  let service: RiderEligibilityService;

  beforeEach(() => {
    service = new RiderEligibilityService();
  });

  it('returns eligible when rider is active, KYC verified, and assigned', () => {
    const result = service.evaluate({
      riderState: 'ACTIVE',
      kycStatus: 'VERIFIED',
      requiredDocumentsVerified: true,
      hasActiveHubAssignment: true,
      hasVehicle: true,
      vehicleDocumentsValid: true,
      hasActiveSlot: true,
      checkedIn: true,
      isSuspended: false,
      serviceType: 'NORMAL',
    });

    expect(result.eligible).toBe(true);
    expect(result.reasons).toEqual([]);
  });

  it('flags missing KYC verification or suspended riders', () => {
    const result = service.evaluate({
      riderState: 'ACTIVE',
      kycStatus: 'DRAFT',
      requiredDocumentsVerified: false,
      hasActiveHubAssignment: true,
      hasVehicle: false,
      vehicleDocumentsValid: true,
      hasActiveSlot: true,
      checkedIn: false,
      isSuspended: true,
      serviceType: 'NORMAL',
    });

    expect(result.eligible).toBe(false);
    expect(result.reasons).toContain('KYC_NOT_VERIFIED');
    expect(result.reasons).toContain('RIDER_SUSPENDED');
  });
});
