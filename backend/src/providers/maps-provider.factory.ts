import { MockMapsProvider } from './mock-maps.provider.js';
import { GoogleMapsProvider } from './google-maps.provider.js';
import type { MapsProviderInterface } from './maps-provider.interface.js';

export function createMapsProvider(): MapsProviderInterface {
  const provider = (process.env.MAPS_PROVIDER ?? 'mock').toLowerCase();

  if (provider === 'google') {
    return new GoogleMapsProvider();
  }

  return new MockMapsProvider();
}
