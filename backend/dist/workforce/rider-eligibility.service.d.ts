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
export declare class RiderEligibilityService {
    evaluate(input: RiderEligibilityInput): {
        eligible: boolean;
        reasons: string[];
    };
}
