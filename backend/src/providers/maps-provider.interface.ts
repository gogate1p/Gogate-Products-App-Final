export type MapsPoint = {
  lat: number;
  lng: number;
};

export type RouteEtaResult = {
  provider: 'mock' | 'google';
  distanceKm: number;
  durationMinutes: number;
  eta?: Date;
  routeGeometry?: string;
};

export interface MapsProviderInterface {
  getRouteEta(
    origin: MapsPoint,
    destination: MapsPoint,
    options?: Record<string, unknown>,
  ): Promise<RouteEtaResult>;

  getLiveTracking(
    routeId: string,
    options?: Record<string, unknown>,
  ): Promise<{ active: boolean; lastSeen?: Date; routeId?: string; }>; 
}
