var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let MockMapsProvider = class MockMapsProvider {
    async getRouteEta(origin, destination, options) {
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
    async getLiveTracking(routeId) {
        return {
            active: true,
            lastSeen: new Date(),
            routeId,
        };
    }
    distanceBetween(a, b) {
        const earthRadiusKm = 6371;
        const dLat = this.toRadians(b.lat - a.lat);
        const dLng = this.toRadians(b.lng - a.lng);
        const lat1 = this.toRadians(a.lat);
        const lat2 = this.toRadians(b.lat);
        const haversine = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
        return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
    }
    toRadians(value) {
        return (value * Math.PI) / 180;
    }
};
MockMapsProvider = __decorate([
    Injectable()
], MockMapsProvider);
export { MockMapsProvider };
//# sourceMappingURL=mock-maps.provider.js.map