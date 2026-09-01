import {
  Injectable,
  Logger,
} from '@nestjs/common';

import type {
  PidgeCreateOrderInput,
} from './pidge.types.js';

@Injectable()
export class PidgeService {
  private readonly logger =
    new Logger(PidgeService.name);

  private get baseUrl() {
    const value =
      process.env.PIDGE_BASE_URL;

    if (!value) {
      throw new Error(
        'PIDGE_BASE_URL is not configured',
      );
    }

    return value.replace(/\/$/, '');
  }

  private get token() {
    const value =
      process.env.PIDGE_API_TOKEN;

    if (!value) {
      throw new Error(
        'PIDGE_API_TOKEN is not configured',
      );
    }

    return value;
  }

  private endpoint(variable: string) {
    const value =
      process.env[variable];

    if (!value) {
      throw new Error(
        `${variable} is not configured. Use the exact Pidge REST path from your Pidge API documentation.`,
      );
    }

    return value.startsWith('/')
      ? value
      : `/${value}`;
  }

  private async request<T>(
    path: string,
    init: RequestInit,
  ): Promise<T> {
    const response =
      await fetch(
        `${this.baseUrl}${path}`,
        {
          ...init,

          headers: {
            'content-type':
              'application/json',

            authorization:
              `Bearer ${this.token}`,

            ...(init.headers ?? {}),
          },
        },
      );

    const text =
      await response.text();

    let body: unknown = null;

    if (text) {
      try {
        body =
          JSON.parse(text);
      } catch {
        body =
          text;
      }
    }

    if (!response.ok) {
      this.logger.error(
        `Pidge ${response.status} ${path}`,
      );

      throw new Error(
        `Pidge API failed (${response.status}): ${
          typeof body === 'string'
            ? body
            : JSON.stringify(body)
        }`,
      );
    }

    return body as T;
  }

  createOrder(
    input: PidgeCreateOrderInput,
  ) {
    return this.request(
      this.endpoint(
        'PIDGE_CREATE_ORDER_PATH',
      ),
      {
        method: 'POST',
        body:
          JSON.stringify(input),
      },
    );
  }

  allocateOrder(
    input:
      Record<string, unknown>,
  ) {
    return this.request(
      this.endpoint(
        'PIDGE_ALLOCATE_ORDER_PATH',
      ),
      {
        method: 'POST',
        body:
          JSON.stringify(input),
      },
    );
  }

  getOrder(
    orderId: string,
  ) {
    const path =
      this.endpoint(
        'PIDGE_GET_ORDER_PATH',
      ).replace(
        ':id',
        encodeURIComponent(orderId),
      );

    return this.request(
      path,
      {
        method: 'GET',
      },
    );
  }

  cancelOrder(
    orderId: string,
    reason?: string,
  ) {
    const path =
      this.endpoint(
        'PIDGE_CANCEL_ORDER_PATH',
      ).replace(
        ':id',
        encodeURIComponent(orderId),
      );

    return this.request(
      path,
      {
        method: 'POST',

        body:
          JSON.stringify({
            reason,
          }),
      },
    );
  }

  createRoute(
    input:
      Record<string, unknown>,
  ) {
    return this.request(
      this.endpoint(
        'PIDGE_CREATE_ROUTE_PATH',
      ),
      {
        method: 'POST',

        body:
          JSON.stringify(input),
      },
    );
  }
}