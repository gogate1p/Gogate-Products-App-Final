export type TrackingServiceType = 'NORMAL' | 'HYPERLOCAL' | 'PRIORITY' | 'TIME_SLOT';
export type TrackingPolicyInput = {
    serviceType: TrackingServiceType | string;
    status: string;
    trackingPolicy?: {
        allowDynamicEta?: boolean;
        allowLiveTracking?: boolean;
        deliveryWindow?: string | null;
    };
};
export type TrackingView = {
    status: string;
    eta: string | null;
    deliveryWindow?: string | null;
    liveTracking: boolean;
    arrivalTime?: string | null;
};
export declare class TrackingPolicyService {
    getTrackingView(input: TrackingServiceType | TrackingPolicyInput): TrackingView;
    private normalizeInput;
}
