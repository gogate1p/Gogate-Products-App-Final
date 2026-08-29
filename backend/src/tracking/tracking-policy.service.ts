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

export class TrackingPolicyService {
  getTrackingView(input: TrackingServiceType | TrackingPolicyInput): TrackingView {
    const normalized = this.normalizeInput(input);
    const policy = normalized.trackingPolicy ?? {};
    const serviceType = (normalized.serviceType ?? 'NORMAL').toUpperCase();
    const status = normalized.status ?? 'PENDING';

    if (serviceType === 'HYPERLOCAL') {
      const eta = policy.allowDynamicEta ? '25-35 mins' : null;
      const arrival = policy.allowDynamicEta ? 'Arriving around 5:30 PM' : null;

      return {
        status,
        eta,
        deliveryWindow: policy.deliveryWindow ?? null,
        liveTracking: Boolean(policy.allowLiveTracking),
        arrivalTime: arrival,
      };
    }

    const standardEta = null;
    const deliveryWindow = policy.deliveryWindow ?? null;

    return {
      status,
      eta: standardEta,
      deliveryWindow,
      liveTracking: false,
      arrivalTime: null,
    };
  }

  private normalizeInput(input: TrackingServiceType | TrackingPolicyInput): TrackingPolicyInput {
    if (typeof input === 'string') {
      return {
        serviceType: input,
        status: 'PENDING',
      };
    }

    return input;
  }
}
