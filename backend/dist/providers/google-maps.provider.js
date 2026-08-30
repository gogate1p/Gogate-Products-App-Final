var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let GoogleMapsProvider = class GoogleMapsProvider {
    async getRouteEta(_origin, _destination, _options) {
        throw new Error('Google Maps integration is intentionally not active in this workspace. Set MAPS_PROVIDER=mock or configure Google Maps credentials in production.');
    }
    async getLiveTracking(_routeId) {
        throw new Error('Google Maps live tracking is not configured for this environment.');
    }
};
GoogleMapsProvider = __decorate([
    Injectable()
], GoogleMapsProvider);
export { GoogleMapsProvider };
//# sourceMappingURL=google-maps.provider.js.map