import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { RealtimeService } from './realtime.service.js';

@WebSocketGateway({ namespace: 'realtime', cors: { origin: true, credentials: true } })
export class RealtimeGateway {
  @WebSocketServer() server!: Server;
  private readonly subscriptions = new Map<string, Set<WebSocket>>();

  constructor(private readonly realtime: RealtimeService) {}

  @SubscribeMessage('subscribe')
  async subscribe(client: WebSocket, payload: { awb: string; tenantId: string; userId: string }) {
    if (!payload?.awb || !payload.tenantId || !payload.userId) return { event: 'error', data: 'Authentication and shipment are required.' };
    const current = await this.realtime.latest(payload.userId, payload.tenantId, payload.awb).catch(() => null);
    const listeners = this.subscriptions.get(payload.awb) ?? new Set<WebSocket>();
    listeners.add(client);
    this.subscriptions.set(payload.awb, listeners);
    if (current) client.send(JSON.stringify({ event: 'location', data: current }));
    return { event: 'subscribed', data: { awb: payload.awb } };
  }

  publish(awb: string, data: unknown) {
    const listeners = this.subscriptions.get(awb);
    listeners?.forEach((client) => { if (client.readyState === 1) client.send(JSON.stringify({ event: 'location', data })); });
  }
}
