import type { MapsPoint, MapsProviderInterface, RouteEtaResult } from './maps-provider.interface.js';
export declare class MockMapsProvider implements MapsProviderInterface {
    getRouteEta(origin: MapsPoint, destination: MapsPoint, options?: Record<string, unknown>): Promise<RouteEtaResult>;
    getLiveTracking(routeId: string): Promise<{
        active: boolean;
        lastSeen?: Date;
        routeId?: string;
    }>;
    private distanceBetween;
    private toRadians;
}
