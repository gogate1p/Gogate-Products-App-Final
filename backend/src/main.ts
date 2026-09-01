import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],
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

  const document = SwaggerModule.createDocument(
    app,
    config,
  );

  SwaggerModule.setup(
    'docs',
    app,
    document,
  );

  await app.listen(
    process.env.PORT ?? 3000,
    '0.0.0.0',
  );
}

await bootstrap();