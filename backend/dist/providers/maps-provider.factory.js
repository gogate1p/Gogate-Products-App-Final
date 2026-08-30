import { MockMapsProvider } from './mock-maps.provider.js';
import { GoogleMapsProvider } from './google-maps.provider.js';
export function createMapsProvider() {
    const provider = (process.env.MAPS_PROVIDER ?? 'mock').toLowerCase();
    if (provider === 'google') {
        return new GoogleMapsProvider();
    }
    return new MockMapsProvider();
}
//# sourceMappingURL=maps-provider.factory.js.map