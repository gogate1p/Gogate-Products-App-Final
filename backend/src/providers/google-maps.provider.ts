import { Injectable } from '@nestjs/common';
import type { MapsPoint, MapsProviderInterface, RouteEtaResult } from './maps-provider.interface.js';

@Injectable()
export class GoogleMapsProvider implements MapsProviderInterface {
  async getRouteEta(
    _origin: MapsPoint,
    _destination: MapsPoint,
    _options?: Record<string, unknown>,
  ): Promise<RouteEtaResult> {
    throw new Error('Google Maps integration is intentionally not active in this workspace. Set MAPS_PROVIDER=mock or configure Google Maps credentials in production.');
  }

  async getLiveTracking(_routeId: string): Promise<{ active: boolean; lastSeen?: Date; routeId?: string }> {
    throw new Error('Google Maps live tracking is not configured for this environment.');
  }
}
