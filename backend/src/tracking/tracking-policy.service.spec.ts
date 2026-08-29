import { TrackingPolicyService } from './tracking-policy.service.js';

describe('TrackingPolicyService', () => {
  it('hides exact rider ETA for standard shipments while exposing a customer-safe status', () => {
    const service = new TrackingPolicyService();

    const view = service.getTrackingView({
      serviceType: 'NORMAL',
      status: 'OUT_FOR_DELIVERY',
      trackingPolicy: {
        allowDynamicEta: false,
        allowLiveTracking: false,
        deliveryWindow: 'Tomorrow, 2:00 PM - 5:00 PM',
      },
    });

    expect(view.eta).toBeNull();
    expect(view.liveTracking).toBe(false);
    expect(view.status).toBe('OUT_FOR_DELIVERY');
    expect(view.deliveryWindow).toBe('Tomorrow, 2:00 PM - 5:00 PM');
  });

  it('shows dynamic ETA and live tracking only for hyperlocal shipments when policy allows it', () => {
    const service = new TrackingPolicyService();

    const view = service.getTrackingView({
      serviceType: 'HYPERLOCAL',
      status: 'OUT_FOR_DELIVERY',
      trackingPolicy: {
        allowDynamicEta: true,
        allowLiveTracking: true,
        deliveryWindow: 'Today, 5:00 PM - 6:00 PM',
      },
    });

    expect(view.eta).toMatch(/\d+\s*[-–]?\s*\d+\s*mins/i);
    expect(view.liveTracking).toBe(true);
    expect(view.status).toBe('OUT_FOR_DELIVERY');
  });
});
