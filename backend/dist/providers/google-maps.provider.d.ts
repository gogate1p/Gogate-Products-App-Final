import type { MapsPoint, MapsProviderInterface, RouteEtaResult } from './maps-provider.interface.js';
export declare class GoogleMapsProvider implements MapsProviderInterface {
    getRouteEta(_origin: MapsPoint, _destination: MapsPoint, _options?: Record<string, unknown>): Promise<RouteEtaResult>;
    getLiveTracking(_routeId: string): Promise<{
        active: boolean;
        lastSeen?: Date;
        routeId?: string;
    }>;
}
