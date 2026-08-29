import { Injectable } from '@nestjs/common';
import type { MapsPoint, MapsProviderInterface, RouteEtaResult } from './maps-provider.interface.js';

@Injectable()
export class MockMapsProvider implements MapsProviderInterface {
  async getRouteEta(
    origin: MapsPoint,
    destination: MapsPoint,
    options?: Record<string, unknown>,
  ): Promise<RouteEtaResult> {
    const distanceKm = Math.max(1, Math.round(this.distanceBetween(origin, destination) * 10) / 10);
    const durationMinutes = Math.max(8, Number(options?.durationMinutes ?? 25));

    return {
      provider: 'mock',
      distanceKm,
      durationMinutes,
      eta: new Date(Date.now() + durationMinutes * 60 * 1000),
      routeGeometry: 'mock-route-polyline',
    };
  }

  async getLiveTracking(routeId: string): Promise<{ active: boolean; lastSeen?: Date; routeId?: string }> {
    return {
      active: true,
      lastSeen: new Date(),
      routeId,
    };
  }

  private distanceBetween(a: MapsPoint, b: MapsPoint): number {
    const earthRadiusKm = 6371;
    const dLat = this.toRadians(b.lat - a.lat);
    const dLng = this.toRadians(b.lng - a.lng);
    const lat1 = this.toRadians(a.lat);
    const lat2 = this.toRadians(b.lat);

    const haversine =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

    return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  }

  private toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }
}
