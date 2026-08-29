export type RiderEligibilityInput = {
  riderState?: string;
  kycStatus?: string;
  requiredDocumentsVerified?: boolean;
  hasActiveHubAssignment?: boolean;
  hasVehicle?: boolean;
  vehicleDocumentsValid?: boolean;
  hasActiveSlot?: boolean;
  checkedIn?: boolean;
  isSuspended?: boolean;
  serviceType?: string;
  vehicleStatus?: string;
  activationStatus?: string;
  welcomeKitStatus?: string;
};

export class RiderEligibilityService {
  evaluate(input: RiderEligibilityInput): { eligible: boolean; reasons: string[] } {
    const reasons: string[] = [];

    if (input.isSuspended) {
      reasons.push('RIDER_SUSPENDED');
    }

    if (input.riderState !== 'ACTIVE') {
      reasons.push('RIDER_NOT_ACTIVE');
    }

    if (input.activationStatus && input.activationStatus !== 'VERIFIED') {
      reasons.push('RIDER_NOT_ACTIVATED');
    }

    if (input.kycStatus !== 'VERIFIED') {
      reasons.push('KYC_NOT_VERIFIED');
    }

    if (input.requiredDocumentsVerified === false) {
      reasons.push('DOCUMENT_NOT_VERIFIED');
    }

    if (input.hasActiveHubAssignment === false) {
      reasons.push('NO_HUB_ASSIGNMENT');
    }

    if (input.hasVehicle === false) {
      reasons.push('VEHICLE_NOT_ELIGIBLE');
    }

    if (input.vehicleStatus && input.vehicleStatus !== 'ACTIVE') {
      reasons.push('VEHICLE_NOT_ACTIVE');
    }

    if (input.vehicleDocumentsValid === false) {
      reasons.push('VEHICLE_DOCUMENT_EXPIRED');
    }

    if (input.hasActiveSlot === false) {
      reasons.push('NO_ACTIVE_SLOT');
    }

    if (input.welcomeKitStatus && input.welcomeKitStatus !== 'DELIVERED') {
      reasons.push('WELCOME_KIT_NOT_DELIVERED');
    }

    if (input.checkedIn === false) {
      reasons.push('NOT_CHECKED_IN');
    }

    return {
      eligible: reasons.length === 0,
      reasons,
    };
  }
}
