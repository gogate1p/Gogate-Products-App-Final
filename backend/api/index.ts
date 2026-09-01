import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AppModule } from '../src/app.module.js';

let handler: ((req: Request, res: Response) => unknown) | undefined;
let initialization: Promise<(req: Request, res: Response) => unknown> | undefined;

async function createHandler() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Tenant-Id',
      'X-Request-Id',
    ],
  });

  const config = new DocumentBuilder()
    .setTitle('Gogate Products Logistics API')
    .setDescription(
      'Customer, merchant, shipper, hub, dispatcher, WMS, admin and delivery operations API',
    )
    .setVersion('2.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.init();
  return app.getHttpAdapter().getInstance() as (
    req: Request,
    res: Response,
  ) => unknown;
}

export default async function vercelHandler(req: Request, res: Response) {
  if (!handler) {
    initialization ??= createHandler();
    handler = await initialization;
  }

  return handler(req, res);
}
