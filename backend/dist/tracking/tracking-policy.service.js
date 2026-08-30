export class TrackingPolicyService {
    getTrackingView(input) {
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
    normalizeInput(input) {
        if (typeof input === 'string') {
            return {
                serviceType: input,
                status: 'PENDING',
            };
        }
        return input;
    }
}
//# sourceMappingURL=tracking-policy.service.js.map